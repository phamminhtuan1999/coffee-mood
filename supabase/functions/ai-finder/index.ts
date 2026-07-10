// Supabase Edge Function: ai-finder (US-029, decision 0021).
// Asks Gemini 2.5 Flash to pick the best cafe from the curated candidates
// and write three why-bullets. Stateless; the GEMINI_API_KEY secret never
// leaves this function (decision 0008: server-side AI only).

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Candidate = {
  id: string;
  name: string;
  meta: string;
  keywords: string[];
  baseScore: number;
};

type FinderRequest = {
  prompt: string;
  profile: {
    cafeTypes: string[];
    priorities: string[];
    distance: string;
    price: string;
  } | null;
  candidates: Candidate[];
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function buildPrompt(request: FinderRequest): string {
  const profileLine = request.profile
    ? `Their taste profile: likes ${request.profile.cafeTypes.join(", ") || "anything"}; ` +
      `cares about ${request.profile.priorities.join(", ") || "nothing specific"}; ` +
      `distance ${request.profile.distance}; price ${request.profile.price}.`
    : "No taste profile on file.";

  const candidateLines = request.candidates
    .map(
      (cafe) =>
        `- id "${cafe.id}": ${cafe.name} (${cafe.meta}); known for: ${cafe.keywords.join(", ")}; base score ${cafe.baseScore}`,
    )
    .join("\n");

  return [
    "You match people to cafes in San Diego.",
    `The user asked: "${request.prompt}"`,
    profileLine,
    "Pick the single best cafe for this request from these candidates only:",
    candidateLines,
    "Write exactly three short why-bullets (under 90 characters each),",
    "warm and specific, grounded only in the candidate data above.",
    "Return bestMatchId (one of the candidate ids) and why (the bullets).",
  ].join("\n");
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return json({ error: "POST only" }, 405);
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");

  if (!apiKey) {
    console.error("ai-finder: GEMINI_API_KEY is not set");
    return json({ error: "provider not configured" }, 500);
  }

  let body: FinderRequest;

  try {
    body = (await request.json()) as FinderRequest;
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }

  if (
    typeof body.prompt !== "string" ||
    body.prompt.trim().length === 0 ||
    !Array.isArray(body.candidates) ||
    body.candidates.length === 0
  ) {
    return json({ error: "prompt and candidates are required" }, 400);
  }

  const candidateIds = body.candidates.map((cafe) => cafe.id);

  const geminiResponse = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(body) }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            bestMatchId: { type: "STRING", enum: candidateIds },
            why: {
              type: "ARRAY",
              items: { type: "STRING" },
              minItems: 3,
              maxItems: 3,
            },
          },
          required: ["bestMatchId", "why"],
        },
        temperature: 0.4,
      },
    }),
  });

  if (!geminiResponse.ok) {
    const detail = await geminiResponse.text();
    console.error(`ai-finder: Gemini ${geminiResponse.status}: ${detail}`);
    return json({ error: "provider error" }, 502);
  }

  try {
    const payload = await geminiResponse.json();
    const text: string | undefined =
      payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text ?? "");

    if (
      typeof parsed.bestMatchId !== "string" ||
      !candidateIds.includes(parsed.bestMatchId) ||
      !Array.isArray(parsed.why)
    ) {
      console.error("ai-finder: response failed contract check");
      return json({ error: "provider response invalid" }, 502);
    }

    return json({
      bestMatchId: parsed.bestMatchId,
      why: parsed.why
        .filter((line: unknown): line is string => typeof line === "string")
        .slice(0, 3),
    });
  } catch (error) {
    console.error(`ai-finder: parse failure: ${String(error)}`);
    return json({ error: "provider response unparseable" }, 502);
  }
});
