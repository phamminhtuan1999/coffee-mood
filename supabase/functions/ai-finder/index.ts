// Supabase Edge Function: ai-finder (US-029, decision 0022).
// Asks Groq (OpenAI-compatible chat completions, JSON mode) to pick the best
// cafe from the curated candidates and write three why-bullets. Stateless;
// the GROQ_API_KEY secret never leaves this function (decision 0008:
// server-side AI only).

// Model is overridable via the GROQ_MODEL secret so a future deprecation is a
// secret change, not a code change.
const GROQ_MODEL = Deno.env.get("GROQ_MODEL") ?? "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Free tiers can return transient 429/503 under load; a short retry usually
// clears it well within the client timeout.
async function callGroqWithRetry(
  apiKey: string,
  requestBody: string,
): Promise<Response> {
  const delays = [0, 700, 1400];
  let last: Response | null = null;

  for (const delay of delays) {
    if (delay > 0) {
      await sleep(delay);
    }

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: requestBody,
    });

    if (response.status !== 429 && response.status !== 503) {
      return response;
    }

    last = response;
  }

  return last as Response;
}

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

  const ids = request.candidates.map((cafe) => `"${cafe.id}"`).join(", ");

  return [
    "You match people to cafes in San Diego.",
    `The user asked: "${request.prompt}"`,
    profileLine,
    "Pick the single best cafe for this request from these candidates only:",
    candidateLines,
    "",
    "Respond with a JSON object of exactly this shape:",
    `{"bestMatchId": <one of ${ids}>, "why": [three strings]}`,
    "Each why-bullet is under 90 characters, warm and specific, grounded only",
    "in the candidate data above. Return JSON only, no prose.",
  ].join("\n");
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return json({ error: "POST only" }, 405);
  }

  const apiKey = Deno.env.get("GROQ_API_KEY");

  if (!apiKey) {
    console.error("ai-finder: GROQ_API_KEY is not set");
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

  const groqResponse = await callGroqWithRetry(
    apiKey,
    JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a concise cafe-matching assistant. You only ever pick " +
            "from the provided candidate ids and reply with strict JSON.",
        },
        { role: "user", content: buildPrompt(body) },
      ],
    }),
  );

  if (!groqResponse.ok) {
    const detail = await groqResponse.text();
    console.error(`ai-finder: Groq ${groqResponse.status}: ${detail}`);
    // Surface the upstream status + a short snippet (never the key — Groq does
    // not echo it) so failures are diagnosable from the response, not only the
    // function logs.
    return json(
      {
        error: "provider error",
        providerStatus: groqResponse.status,
        providerDetail: detail.slice(0, 300),
      },
      502,
    );
  }

  try {
    const payload = await groqResponse.json();
    const text: string | undefined = payload?.choices?.[0]?.message?.content;
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
