import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useForm } from "react-hook-form";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import GlassmorphismCard from "../../components/GlassmorphismCard/GlassmorphismCard";
import GlassmorphismOtpInput from "../../components/Forms/GlassmorphismOtpInput";
import LinearGradientFormSubmitButton from "../../components/Forms/LinearGradientFormSubmitButton";

import { getItem } from "../../utils/asyncStorage";
import {
  useVerifyOtpMutation,
  useSendOtpMutation,
} from "../../store/services/authApi";

import Toast from "react-native-toast-message";

const VerificationCode = () => {
  const { email } = useLocalSearchParams();

  const [userEmail, setUserEmail] = useState(email || "");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: ["", "", "", ""],
    },
  });

  const [timer, setTimer] = useState(24);
  const [canResend, setCanResend] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);

  const [verifyOtp] = useVerifyOtpMutation();
  const [sendOtp] = useSendOtpMutation();

  // Load email
  useEffect(() => {
    const loadEmail = async () => {
      if (!email) {
        const storedEmail = await getItem("userEmail");

        if (storedEmail) {
          setUserEmail(storedEmail);
        }
      }
    };

    loadEmail();
  }, []);

  // Timer
  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer]);

  // OTP Expiry
  useEffect(() => {
    const otpTimer = setTimeout(() => {
      setOtpExpired(true);
    }, 5 * 60 * 1000);

    return () => clearTimeout(otpTimer);
  }, []);

  const onSubmit = async (data) => {
    if (otpExpired) return;

    const otpValue = data.otp.join("");

    try {
      const response = await verifyOtp({
        email: userEmail,
        otp: otpValue,
      }).unwrap();

      Toast.show({
        type: "success",
        text1: "OTP Verified",
        text2: response?.message || "Create new password",
      });

      router.push({
        pathname: "(auth)/newpassword",
        params: {
          email: userEmail,
        },
      });
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
    <View style={{ flex: 1, backgroundColor: "#0C1013" }}>
      <ImageBackground
        source={require("../../assets/images/on-boarding-bg-1.png")}
        style={styles.background}
        imageStyle={{ opacity: 0.4 }}
        blurRadius={Platform.OS === "ios" ? 60 : 30}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />

          {/* Back Button */}
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
          >
            <GlassmorphismCard
              style={styles.backCard}
              gradientStyle={styles.backGradient}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color="#fff"
              />
            </GlassmorphismCard>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Verify Code</Text>

            <Text style={styles.subtitle}>
              Enter the 4-digit verification code sent to{" "}
              {userEmail || "your email"}.
            </Text>
          </View>

          {/* Glass Card */}
          <View style={styles.formWrapper}>
            <BlurView
              intensity={20}
              style={styles.blurContainer}
            >
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.10)",
                  "rgba(255,255,255,0.03)",
                ]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientCard}
              >
                <Text style={styles.formTitle}>
                  OTP Verification
                </Text>

                <View style={styles.formContainer}>
                  <GlassmorphismOtpInput control={control} />

                  {errors.otp && (
                    <Text style={styles.error}>
                      {errors.otp.message}
                    </Text>
                  )}
                </View>

                {/* Continue Button */}
                <LinearGradientFormSubmitButton
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  text={"Continue"}
                  colors={["#635BFF", "#1C2D47"]}
                  style={{
                    marginTop: 35,
                    opacity: otpExpired ? 0.6 : 1,
                  }}
                />

                {/* Timer */}
                <Text style={styles.timerText}>
                  {otpExpired
                    ? "OTP expired"
                    : `Didn’t receive the code? Wait (${timer}s)`}
                </Text>

                {/* Expired */}
                {otpExpired && (
                  <Text style={styles.errorCenter}>
                    OTP expired. Please request a new one.
                  </Text>
                )}

                {/* Resend */}
                {canResend && !otpExpired ? (
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        await sendOtp({
                          email: userEmail,
                        }).unwrap();

                        setTimer(24);
                        setCanResend(false);
                        setOtpExpired(false);

                        Toast.show({
                          type: "success",
                          text1: "OTP Resent",
                          text2:
                            "Please check your email",
                        });
                      } catch (err) {
                        console.log(
                          "Resend OTP failed:",
                          err?.data?.message
                        );

                        Toast.show({
                          type: "error",
                          text1: "Failed",
                          text2:
                            err?.data?.message ||
                            "Something went wrong",
                        });
                      }
                    }}
                  >
                    <Text style={styles.resendText}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                ) : (
                  !otpExpired && (
                    <Text style={styles.waitText}>
                      Wait ({timer}s)
                    </Text>
                  )
                )}
              </LinearGradient>
            </BlurView>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default VerificationCode;

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
    borderRadius: 15,
    height: 45,
    width: 45,
  },

  backGradient: {
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
  },

  titleContainer: {
    marginTop: 35,
    marginBottom: 35,
  },

  title: {
    fontWeight: "800",
    color: "#fff",
    fontSize: 34,
  },

  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.55)",
    marginTop: 8,
    lineHeight: 24,
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
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },

  formContainer: {
    gap: 20,
    alignItems: "center",
  },

  error: {
    color: "#FF4C45",
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
  },

  errorCenter: {
    color: "#FF4C45",
    fontSize: 13,
    textAlign: "center",
    marginTop: 14,
  },

  timerText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    marginTop: 18,
  },

  resendText: {
    color: "#635BFF",
    textAlign: "center",
    marginTop: 18,
    fontWeight: "700",
    fontSize: 14,
  },

  waitText: {
    color: "rgba(255,255,255,0.45)",
    textAlign: "center",
    marginTop: 12,
    fontSize: 13,
  },
});