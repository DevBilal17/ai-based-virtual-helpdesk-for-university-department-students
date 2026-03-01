import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import GlassmorphismCard from "../components/GlassmorphismCard/GlassmorphismCard";
import { useForm } from "react-hook-form";
import LinearGradientFormSubmitButton from "../components/Forms/LinearGradientFormSubmitButton";
import { router, useLocalSearchParams } from "expo-router";
import GlassmorphismOtpInput from "../components/Forms/GlassmorphismOtpInput";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getItem } from "../utils/asyncStorage";
import { useVerifyOtpMutation } from "../store/services/authApi";
import Toast from "react-native-toast-message";
const VerificationCode = () => {
  const { email } = useLocalSearchParams();
  const [userEmail, setUserEmail] = useState(email || "");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: ["", "", "", ""] },
  });

  const [timer, setTimer] = useState(24); // countdown for resend
  const [canResend, setCanResend] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);

  const [verifyOtp] = useVerifyOtpMutation();

  // Load email from storage if not passed in params
  useEffect(() => {
    const loadEmail = async () => {
      if (!email) {
        const storedEmail = await getItem("userEmail");
        if (storedEmail) setUserEmail(storedEmail);
      }
    };
    loadEmail();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // OTP expiry after 5 minutes
  useEffect(() => {
    const otpTimer = setTimeout(() => setOtpExpired(true), 5 * 60 * 1000);
    return () => clearTimeout(otpTimer);
  }, []);

  // Handle OTP submission
  const onSubmit = async (data) => {
    if (otpExpired) return; // disable submit if expired
    const otpValue = data.otp.join("");
    try {
      const response = await verifyOtp({ email: userEmail, otp: otpValue }).unwrap();
      console.log("OTP verified ", response);
        Toast.show({
            type: "success",
            text1: "OTP Verified",
            text2: response?.message || "Create new password",
          });
       router.push({
            pathname: "/newpassword",
            params: { email: userEmail },
          }); // navigate to new password screen
    } catch (err) {
      console.log("OTP verify failed", err?.data?.message);
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
          <Text style={styles.title}>Verify Your Code</Text>
          <Text style={styles.subtitle}>
            A verification code has been sent to {userEmail}.Enter it belowto
            continue.
          </Text>
        </View>
        <View style={styles.formContainer}>
          <GlassmorphismOtpInput control={control} />
          {errors.otp && <Text style={styles.error}>{errors.otp.message}</Text>}
        </View>

        {/* Disabled when otp expired */}
        <LinearGradientFormSubmitButton
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          text={"Continue"}
          style={{ marginTop: 20 }}
        />
        <Text style={styles.timerText}>
          {otpExpired
            ? "OTP expired"
            : `Don’t receive the code? Wait (${timer}s)`}
        </Text>
        {otpExpired && (
          <Text style={[styles.error, { textAlign: "center" }]}>
            OTP expired. Please request a new one.
          </Text>
        )}
        {canResend && !otpExpired ? (
          <TouchableOpacity
            onPress={async () => {
              try {
                // Call your sendOtp mutation
                await sendOtp({ email: userEmail }).unwrap();
                setTimer(24); // reset wait timer
                setCanResend(false);
                setOtpExpired(false);
              } catch (err) {
                console.log("Resend OTP failed:", err?.data?.message);
              }
            }}
          >
            <Text
              style={{ color: "#3C82F2", textAlign: "center", marginTop: 10 }}
            >
              Resend OTP
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.timerText}>Wait ({timer}s)</Text>
        )}
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
