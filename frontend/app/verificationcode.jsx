import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
} from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassmorphismCard from "../components/GlassmorphismCard/GlassmorphismCard";
import { useForm, Controller } from "react-hook-form";
import GlassmorphismInput from "../components/Forms/GlassmorphismInput";
import LinearGradientFormSubmitButton from "../components/Forms/LinearGradientFormSubmitButton";
import { router } from "expo-router";
import GlassmorphismOtpInput from "../components/Forms/GlassmorphismOtpInput";
import { Ionicons } from "@expo/vector-icons";
const VerificationCode = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: ["", "", "", ""],
    },
  });

  const onSubmit = (data) => {
    const otpValue = data.otp.join("");
    console.log("OTP:", otpValue);
  };
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <ImageBackground
        source={require("../assets/images/on-boarding-bg-1.png")}
        style={styles.container}
      >
        {/* Back Button */}
        <TouchableOpacity onPress={handleBack}>
          <GlassmorphismCard
            style={{ borderRadius: 20, height: 40, width: 40 }}
            gradientStyle={{
              height: 40,
              width: 40,
              paddingHorizontal: 0,
              paddingVertical: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </GlassmorphismCard>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Verify Your Code</Text>
          <Text style={styles.subtitle}>
            A verification code has been sent to butta****gmail.com.Enter it
            belowto continue.
          </Text>
        </View>
        <View style={styles.formContainer}>
          <GlassmorphismOtpInput control={control} />
          {errors.otp && <Text style={styles.error}>{errors.otp.message}</Text>}
        </View>
        <LinearGradientFormSubmitButton
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          text={"Continue"}
          style={{ marginTop: 20 }}
        />
        <Text style={styles.timerText}>Don’t receive the code? Wait(24s)</Text>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default VerificationCode;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    flex: 1,
    paddingVertical: 20,
  },
  titleContainer: {
    paddingLeft: 14,
    marginTop: 40,
  },
  title: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 32,
    //  lineHeight:22,
    fontFamily: "Roboto",
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Roboto",
    lineHeight: 22,
    color: "#C8CACD",
    textAlign: "left",
  },
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "#FF4C45",
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  formContainer: {
    marginTop: 40,
  },
  label: {
    fontSize: 17,
    fontFamily: "Inter",
    marginBottom: 8,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 15,
  },
  timerText: {
    fontSize: 16,
    fontFamily: "Roboto",
    color: "#C8CACD",
    textAlign: "center",
    marginTop: 20,
  },
});
