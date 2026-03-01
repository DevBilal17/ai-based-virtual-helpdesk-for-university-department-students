import { Stack } from "expo-router";

import { useEffect, useState } from "react";
import "../global.css";
import { getItem, removeItem } from "../utils/asyncStorage";
import { Provider } from "react-redux";
import { store } from "../store/store";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
export default function RootLayout() {
  const [isShowOnboarding, setIsShowOnboarding] = useState(null);

  useEffect(()=>{
    //  resetOnBoarding()
     resetLoggedIn()
  },[])
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const resetOnBoarding = async()=>{
    await removeItem("onboardingCompleted");
  }
  const resetLoggedIn = async()=>{
    await removeItem("loggedIn")
  }

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
      <Provider store={store}>
        <Stack
        initialRouteName="login"
        screenOptions={{
          headerShown: false,
        }}
        
      />
      <Toast config={toastConfig} topOffset={10}/>
      </Provider>
    );
  }
  return (
    <Provider store={store}>
      <Stack
      initialRouteName="onboarding"
      screenOptions={{
        headerShown: false,
      }}
    />
    <Toast config={toastConfig}/>
    </Provider>
  );
}

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green", height: 80 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 16,
      }}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", height: 80 }}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 16,
      }}
    />
  ),
};