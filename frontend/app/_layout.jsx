import { Stack } from "expo-router";

import { useEffect, useState } from "react";
import "../global.css";
import { getItem } from "../utils/asyncStorage";

export default function RootLayout() {
  const [isShowOnboarding, setIsShowOnboarding] = useState(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    let status = await getItem("onboardingCompleted");

    if (status === "true") {
      setIsShowOnboarding(false);
    } else {
      setIsShowOnboarding(true);
    }
  };

  if (isShowOnboarding === null) {
    return null; //or loading indicator
  }

  if (!isShowOnboarding) {
    return (
      <Stack
        initialRouteName="resetpassword"
        screenOptions={{
          headerShown: false,
        }}
      />
    );
  }
  return (
    <Stack
      initialRouteName="onboarding"
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
