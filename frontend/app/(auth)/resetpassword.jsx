import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import GlassmorphismCard from "../../components/GlassmorphismCard/GlassmorphismCard";
import GlassmorphismInput from "../../components/Forms/GlassmorphismInput";
import LinearGradientFormSubmitButton from "../../components/Forms/LinearGradientFormSubmitButton";

import { useSendOtpMutation } from "../../store/services/authApi";
import { setItem } from "../../utils/asyncStorage";

import Toast from "react-native-toast-message";

const ResetPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [sendOTP, { isLoading }] = useSendOtpMutation();

  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);

      const response = await sendOTP(data).unwrap();

      await setItem("userEmail", data.email);

      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: response?.message || "Please check your email",
      });

      router.push({
        pathname: "/verificationcode",
        params: { email: data.email },
      });
    } catch (err) {
      console.log("OTP Generation Failed", err);

      Toast.show({
        type: "error",
        text1: "Request Failed",
        text2: err?.data?.message || "Something went wrong",
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0C1013" }}>
      <ImageBackground
        source={require("../../assets/images/on-boarding-bg-1.png")}
        style={styles.background}
        imageStyle={{ opacity: 0.4 }}
        blurRadius={Platform.OS === "ios" ? 60 : 30}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar  />

          {/* Back Button */}
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <GlassmorphismCard
              style={styles.backCard}
              gradientStyle={styles.backGradient}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </GlassmorphismCard>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Reset Password</Text>

            <Text style={styles.subtitle}>
              Enter your email address and we’ll send you a verification OTP.
            </Text>
          </View>

          {/* Form Card */}
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
                <Text style={styles.formTitle}>Email Verification</Text>

                <View style={styles.formContainer}>
                  {/* EMAIL */}
                  <View>
                    <Text style={styles.label}>Email</Text>

                    <Controller
                      control={control}
                      name="email"
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Enter a valid email",
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <GlassmorphismInput
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value}
                          placeholder={"Enter your email"}
                          keyboardType={"email-address"}
                          iconName={"mail-outline"}
                        />
                      )}
                    />

                    {errors.email && (
                      <Text style={styles.error}>
                        {errors.email.message}
                      </Text>
                    )}
                  </View>
                </View>

               <LinearGradientFormSubmitButton
  handleSubmit={handleSubmit}
  onSubmit={onSubmit}
  text={isLoading ? "Sending OTP..." : "Continue"}
  colors={["#635BFF", "#1C2D47"]}
  style={{
    marginTop: 35,
    opacity: isLoading ? 0.7 : 1,
  }}
/>
              </LinearGradient>
            </BlurView>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  
  },

  backButton: {
     marginTop: 10,
  },

  backCard: {
    borderRadius: 16,
    height: 46,
    width: 46,
  },

  backGradient: {
    height: 46,
    width: 46,
    justifyContent: "center",
    alignItems: "center",
  },

  titleContainer: {
    marginTop: 35,
    marginBottom: 35,
    // alignItems: "center",
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    // textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.55)",
    marginTop: 10,
    lineHeight: 24,
    // textAlign: "center",
    paddingHorizontal: 10,
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
    paddingHorizontal: 22,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 30,
  },

  formTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 28,
  },

  formContainer: {
    gap: 22,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    marginBottom: 8,
    marginLeft: 6,
  },

  error: {
    color: "#FF4C45",
    fontSize: 13,
    marginTop: 6,
    marginLeft: 6,
  },
});