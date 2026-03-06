import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassmorphismCard from "../components/GlassmorphismCard/GlassmorphismCard";
import GlassmorphismOtpInput from "../components/Forms/GlassmorphismOtpInput";
import LinearGradientFormSubmitButton from "../components/Forms/LinearGradientFormSubmitButton";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import GlassmorphismInput from "../components/Forms/GlassmorphismInput";
import { useNewPasswordMutation } from "../store/services/authApi";
import Toast from "react-native-toast-message";
import { getItem } from "../utils/asyncStorage";

const newpassword = () => {
  const { email } = useLocalSearchParams();
    const [userEmail, setUserEmail] = useState(email || "");
  const [changePassword,{isLoading,error}] = useNewPasswordMutation()
   // Load email from storage if not passed in params
    useEffect(() => {
      const loadEmail = async () => {
        if (!email) {
          const storedEmail = await getItem("userEmail");
          console.log(storedEmail)
          if (storedEmail) setUserEmail(storedEmail);
        }
      };
      loadEmail();
    }, []);
  const handleBack = () => {
    router.back();
  };
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
const onSubmit = async (data) => {
  try {
    // Call your API to change password
    const response = await changePassword({
      email: userEmail,        
      password: data.password,
    }).unwrap();

    console.log("Password Changed:", response);

    // Show success toast
    Toast.show({
      type: "success",
      text1: "Password Changed",
      text2: response?.message || "You can now login with your new password",
      visibilityTime: 3000,
    });

    // Navigate to login screen with email pre-filled
    router.push({
      pathname: "/login",
      params: { email: userEmail },
    });

  } catch (err) {
    console.log("Password not changed:", err?.data?.data?.msg || err.message);
    console.log(err.data)
    // Show error toast
    Toast.show({
      type: "error",
      text1: "Failed to Change Password",
      text2: err?.data?.message || "Please try again",
      visibilityTime: 3000,
    });
  }
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
          <Text style={styles.title}>Create a new password</Text>
          <Text style={styles.subtitle}>Enter your new password.</Text>
        </View>
        <View style={styles.formContainer}>
          {/* Password */}
          <View>
            <Text style={styles.label}>Password</Text>
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <GlassmorphismInput
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder={"Enter your password"}
                  style={{}}
                  secureTextEntry={true} // hides password input
                  
                  isPassword={true}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
          </View>

          {/* Confirm Password */}
          <View>
            <Text style={styles.label}>Confirm Password</Text>
            <Controller
              control={control}
              name="cpassword"
              rules={{
                required: "Confirm Password is required",
                validate: (value) =>
                  value === getValues("password") ||
                  "Passwords do not match",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <GlassmorphismInput
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder={"Confirm your password"}
                  style={{}}
                  secureTextEntry={true}
                  isPassword={true}
                />
              )}
            />
            {errors.cpassword && (
              <Text style={styles.error}>{errors.cpassword.message}</Text>
            )}
          </View>
        </View>
        <LinearGradientFormSubmitButton
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          text={"Continue"}
          style={{ marginTop: 40 }}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default newpassword;

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
    gap:20
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
