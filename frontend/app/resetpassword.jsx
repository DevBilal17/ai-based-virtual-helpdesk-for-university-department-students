import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassmorphismCard from "../components/GlassmorphismCard/GlassmorphismCard";
import { useForm, Controller } from "react-hook-form";
import GlassmorphismInput from "../components/Forms/GlassmorphismInput";
import LinearGradientFormSubmitButton from "../components/Forms/LinearGradientFormSubmitButton";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSendOtpMutation } from "../store/services/authApi";
import { setItem } from "../utils/asyncStorage";
import Toast from "react-native-toast-message";
const ResetPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [sendOTP, { isLoading, error }] = useSendOtpMutation();

 const onSubmit = async (data) => {
  try {
    console.log("Form Data:", data);

    const response = await sendOTP(data).unwrap();
    console.log(response)
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
    console.log(err)
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
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            To reset your password enter your email and we’ll send you an OTP
            code.
          </Text>
        </View>

        {/* Reminder! Replace Later with Email Input Component */}
        <View style={styles.formContainer}>
          {/* EMAIL */}
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
                style={{}}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}
        </View>
        <LinearGradientFormSubmitButton
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          text={isLoading?"...":"Continue"}
          style={{ marginTop: 20 , opacity: isLoading ? 0.7 : 1 }}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ResetPassword;

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
    color: "red",
    marginBottom: 15,
    fontSize: 12,
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
});
