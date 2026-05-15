import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
// import "react-native-gesture-handler";
import { getItem } from "../utils/asyncStorage";

import { Provider, useDispatch } from "react-redux";
import { store } from "../store/store";

import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

import { setCredentials } from "../store/slices/authSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
function AppContent() {
  const [isShowOnboarding, setIsShowOnboarding] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const onboardingStatus = await getItem("onboardingCompleted");
        setIsShowOnboarding(onboardingStatus !== "true");

        const token = await getItem("token");
        const user = await getItem("user");
        const loggedIn = await getItem("loggedIn");

        if (token && user) {
          dispatch(
            setCredentials({
              token,
              user: JSON.parse(user),
            }),
          );
        }

        setIsLoggedIn(loggedIn === "true");
      } catch (error) {
        console.log(error);
      }
    };

    initializeApp();
  }, []);

  if (isShowOnboarding === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#00ffcc" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {isShowOnboarding ? (
          <Stack.Screen name="onboarding" />
        ) : isLoggedIn ? (
          <Stack.Screen
            name="(tabs)"
            options={{
              gestureEnabled: false,
            }}
          />
        ) : (
          <Stack.Screen name="(auth)/login" />
        )}

        <Stack.Screen name="(auth)/verificationcode" />
        <Stack.Screen name="(auth)/resetpassword" />
        <Stack.Screen name="(auth)/newpassword" />
      </Stack>

      <Toast config={toastConfig} topOffset={50} />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
      <AppContent />
      </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const toastConfig = {
  success: (props) => (
    <BaseToast {...props} style={{ borderLeftColor: "green", height: 80 }} />
  ),

  error: (props) => (
    <ErrorToast {...props} style={{ borderLeftColor: "red", height: 80 }} />
  ),
};
