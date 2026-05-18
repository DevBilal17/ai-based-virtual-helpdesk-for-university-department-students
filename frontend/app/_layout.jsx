import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
} from "react-native";

import "../global.css";

import { Provider, useDispatch } from "react-redux";
import { store } from "../store/store";

import Toast, {
  BaseToast,
  ErrorToast,
} from "react-native-toast-message";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { getItem } from "../utils/asyncStorage";
import { setCredentials } from "../store/slices/authSlice";

function AppContent() {
  const dispatch = useDispatch();

  const [showOnboarding, setShowOnboarding] =
    useState(null);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        /**
         * Load all persisted app data
         */
        const [
          onboardingStatus,
          token,
          user,
          loggedIn,
        ] = await Promise.all([
          getItem("onboardingCompleted"),
          getItem("token"),
          getItem("user"),
          getItem("loggedIn"),
        ]);

        /**
         * Determine onboarding visibility
         */
        setShowOnboarding(
          onboardingStatus !== "true"
        );

        /**
         * Restore authenticated user
         */
        if (token && user) {
          try {
            const parsedUser = JSON.parse(user);

            dispatch(
              setCredentials({
                token,
                user: parsedUser,
              })
            );
          } catch (parseError) {
            console.log(
              "User Parse Error:",
              parseError
            );
          }
        }

        /**
         * Restore login state
         */
        setIsLoggedIn(loggedIn === "true");
      } catch (error) {
        console.log(
          "App Initialization Error:",
          error
        );
      }
    };

    initializeApp();
  }, [dispatch]);

  /**
   * Initial app loader
   */
  if (showOnboarding === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#00ffcc"
        />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {showOnboarding ? (
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

        {/* Auth Screens */}
        <Stack.Screen name="(auth)/verificationcode" />
        <Stack.Screen name="(auth)/resetpassword" />
        <Stack.Screen name="(auth)/newpassword" />
      </Stack>

      <Toast
        config={toastConfig}
        topOffset={50}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView
        style={{ flex: 1 }}
      >
        <BottomSheetModalProvider>
          <AppContent />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "green",
        minHeight: 80,
      }}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "red",
        minHeight: 80,
      }}
    />
  ),
};