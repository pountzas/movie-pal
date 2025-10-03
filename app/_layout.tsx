import { Stack } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Alert } from "react-native";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    // Handle update errors gracefully
    Updates.addListener((event) => {
      if (event.type === Updates.UpdateEventType.ERROR) {
        console.warn("Update error:", event.message);
        // Don't show alert to user for update errors - just log them
      }
    });

    // Check for updates but don't block app launch on errors
    Updates.checkForUpdateAsync()
      .then((update) => {
        if (update.isAvailable) {
          return Updates.fetchUpdateAsync();
        }
      })
      .then((update) => {
        if (update?.isNew) {
          Updates.reloadAsync();
        }
      })
      .catch((error) => {
        console.warn("Update check failed:", error.message);
        // Silently handle update errors - don't crash the app
      });
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    />
  );
}
