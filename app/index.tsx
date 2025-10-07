import { useColorScheme } from "nativewind";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import "../global.css";
import { Switch, View } from "react-native";
import { useState } from "react";
import Search from "@/components/Search";
import MoviesList from "@/components/MoviesList";

export default function App() {
  const { toggleColorScheme } = useColorScheme();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    toggleColorScheme();
    setIsEnabled(!isEnabled);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="dark h-full bg-gray-300 dark:bg-gray-900 dark:text-gray-50">
        <View className="mx-4 my-5 flex flex-row items-center justify-between">
          <Search />
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <MoviesList />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
