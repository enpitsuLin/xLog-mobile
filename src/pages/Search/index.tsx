import type { FC } from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, TextInput } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Search } from "@tamagui/lucide-icons";
import { XStack, Button } from "tamagui";

import { FeedList } from "@/components/FeedList";
import { useColors } from "@/hooks/use-colors";
import type { RootStackParamList } from "@/navigation/types";
import { debounce } from "@/utils/debounce";

export interface Props {
  sortType?: any
}

export const SearchPage: FC<NativeStackScreenProps<RootStackParamList, "Search">> = (props) => {
  const { navigation } = props;
  const i18n = useTranslation("common");
  const [search, _setSearch] = useState("");
  const setSearch = debounce(_setSearch, 500);
  const { color } = useColors();
  const ref = useRef<TextInput>(null);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <Animated.View entering={FadeInRight.duration(500)} >
        <XStack alignItems="center" marginHorizontal={10} gap={"$2"} paddingBottom="$3">
          <XStack
            borderWidth={1}
            borderRadius={"$4"}
            borderColor={"$borderColor"}
            height={"$4"}
            alignItems={"center"}
            paddingHorizontal={"$3"}
            gap="$2"
            paddingVertical={2}
            flex={1}
            onPress={() => ref.current?.focus()}
          >
            <Search color="$colorSubtitle" size={"$1"}/>
            <TextInput ref={ref} style={{ color, flex: 1 }} autoFocus onChangeText={setSearch}/>
          </XStack>
          <Button onPress={navigation.goBack}>{i18n.t("Cancel")}</Button>
        </XStack>
      </Animated.View>
      <FeedList
        daysInterval={7}
        type={"search"}
        searchKeyword={search}
        onScroll={() => Keyboard.isVisible() && Keyboard.dismiss()}
      />
    </SafeAreaView>
  );
};
