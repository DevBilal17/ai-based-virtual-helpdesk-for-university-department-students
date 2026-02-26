
import { Stack } from "expo-router";

import "../global.css";

export default function RootLayout() {
  
  return (
    <Stack initialRouteName="onboarding">
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          title: "Onboarding",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
