import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassmorphismCard from "../../components/GlassmorphismCard/GlassmorphismCard";
import LinearGradientFormSubmitButton from "../../components/Forms/LinearGradientFormSubmitButton";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import GlassmorphismInput from "../../components/Forms/GlassmorphismInput";
import { useNewPasswordMutation } from "../../store/services/authApi";
import Toast from "react-native-toast-message";
import { getItem } from "../../utils/asyncStorage";
import { useSelector } from "react-redux";

const newpassword = () => {
  const { email, source } = useLocalSearchParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const [userEmail, setUserEmail] = useState(email || "");
  const [changePassword, { isLoading }] = useNewPasswordMutation();

  useEffect(() => {
    if (email) {
      setUserEmail(email);
    } else if (source === "profile" && loggedInUser?.email) {
      setUserEmail(loggedInUser.email);
    } else {
      const loadEmail = async () => {
        const storedEmail = await getItem("userEmail");
        if (storedEmail) setUserEmail(storedEmail);
      };
      loadEmail();
    }
  }, [email, loggedInUser, source]);

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
      const response = await changePassword({
        email: userEmail,
        password: data.password,
      }).unwrap();

      Toast.show({
        type: "success",
        text1: "Password Changed",
        text2: response?.message || "Success",
        visibilityTime: 3000,
      });

      if (source === 'profile') {
        router.back();
      } else {
        router.replace({
          pathname: "/login",
          params: { email: userEmail },
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Failed to Change Password",
        text2: err?.data?.message || "Please try again",
      });
    }
  };

  return (
    // Background color fix to match Home/Profile
    <View style={{ flex: 1, backgroundColor: "#0C1013" }}>
      <ImageBackground
        source={require("../../assets/images/on-boarding-bg-1.png")}
        style={styles.background}
        imageStyle={{ opacity: 0.4 }}
        blurRadius={Platform.OS === "ios" ? 60 : 30}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />

          {/* Header */}
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <GlassmorphismCard
              style={styles.backCard}
              gradientStyle={styles.backGradient}
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </GlassmorphismCard>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>New Password</Text>
            <Text style={styles.subtitle}>Enter your new security credentials.</Text>
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
                  minLength: { value: 6, message: "Min 6 characters" },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <GlassmorphismInput
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={"Enter your password"}
                    secureTextEntry={true}
                    isPassword={true}
                  />
                )}
              />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
            </View>

            {/* Confirm Password */}
            <View>
              <Text style={styles.label}>Confirm Password</Text>
              <Controller
                control={control}
                name="cpassword"
                rules={{
                  required: "Confirm Password is required",
                  validate: (value) => value === getValues("password") || "Passwords do not match",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <GlassmorphismInput
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={"Confirm your password"}
                    secureTextEntry={true}
                    isPassword={true}
                  />
                )}
              />
              {errors.cpassword && <Text style={styles.error}>{errors.cpassword.message}</Text>}
            </View>
          </View>

          {/* Button color fix: Using your brand Purple Gradient */}
          <LinearGradientFormSubmitButton
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            text={isLoading ? "Updating..." : "Continue"}
            colors={["#635BFF", "#1C2D47"]} // Brand Colors
            style={styles.submitBtn}
          />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  backButton: { marginTop: 10 },
  backCard: { borderRadius: 15, height: 45, width: 45 },
  backGradient: { height: 45, width: 45, alignItems: "center", justifyContent: "center" },
  titleContainer: { marginTop: 35 },
  title: { fontWeight: "800", color: "#fff", fontSize: 32 },
  subtitle: { fontSize: 16, color: "rgba(255,255,255,0.5)", marginTop: 5 },
  formContainer: { marginTop: 40, gap: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#fff", marginBottom: 8, marginLeft: 5, opacity: 0.7 },
  error: { color: "#FF4C45", fontSize: 14, marginTop: 5, marginLeft: 5 },
  submitBtn: { marginTop: 40 }
});

export default newpassword;