import { View } from "react-native";

import { SearchScreenContent } from "@/components/search/search-screen-content";
import { AppTabBar } from "@/components/ui";
import { theme } from "@/constants/theme";

export default function SearchScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.cream50 }}>
      <SearchScreenContent />
      <AppTabBar active="Search" />
    </View>
  );
}
