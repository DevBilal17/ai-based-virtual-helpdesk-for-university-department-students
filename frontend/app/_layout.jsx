import { Stack } from "expo-router";

import "../global.css";

export default function RootLayout() {
  return (
    <Stack
      initialRouteName="onboarding"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          title: "Onboarding",
        }}
      />
    </Stack>
  );
}
