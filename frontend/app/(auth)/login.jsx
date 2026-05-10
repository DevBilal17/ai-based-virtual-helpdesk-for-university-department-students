import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import LoginForm from "../../components/Forms/LoginForm";

import { getItem, removeItem } from "../../utils/asyncStorage";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [checkingAuth, setCheckingAuth] = useState(true);

useEffect(() => {
  checkLoggedInStatus();
}, []);

const checkLoggedInStatus = async () => {
  try {
    const status = await getItem("loggedIn");

    console.log("STATUS:", status);

    if (status === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  } catch (err) {
    console.log(err);
    setIsLoggedIn(false);
  } finally {
    setCheckingAuth(false);
  }
};
if (checkingAuth) {
  return null;
}
  if (isLoggedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0C1013" }}>
      <ImageBackground
        source={require("../../assets/images/on-boarding-bg-1.png")}
        style={styles.background}
        imageStyle={{ opacity: 0.4 }}
        blurRadius={Platform.OS === "ios" ? 60 : 30}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />

          {/* Header */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome Back</Text>

            <Text style={styles.subtitle}>
              Login to continue your smart learning journey.
            </Text>
          </View>

          {/* Login Card */}
          <View style={styles.formWrapper}>
            <BlurView intensity={20} style={styles.blurContainer}>
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.10)",
                  "rgba(255,255,255,0.03)",
                ]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientCard}
              >
                <Text style={styles.formTitle}>Login</Text>

                <LoginForm />
              </LinearGradient>
            </BlurView>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  titleContainer: {
    marginBottom: 35,
  },

  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 48,
    textAlign:"center"
  },

  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.55)",
    marginTop: 8,
    lineHeight: 24,
    textAlign:"center"
  },

  formWrapper: {
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  blurContainer: {
    borderRadius: 30,
    overflow: "hidden",
  },

  gradientCard: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 30,
  },

  formTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
  },
});