import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import { setItem } from "../../utils/asyncStorage";

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    await setItem("loggedIn","true")
  };
  const navigation = useNavigation();
  const handleForgotButton = () => {
    navigation.navigate("resetpassword");
  };

  

  return (
    <View style={styles.container}>
      <View>
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
            <TextInput
              style={[
                styles.input,
                {
                  paddingHorizontal: 15,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={"#F7FEFF99"}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}
      </View>

      <View>
        {/* PASSWORD */}
        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  paddingHorizontal: 15,
                },
              ]}
              placeholder="Enter your password"
              placeholderTextColor={"#F7FEFF99"}
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}

        <View style={styles.forgotContainer}>
          {/* REMEMBER ME */}
          <Controller
            control={control}
            name="remember"
            render={({ field: { value, onChange } }) => (
              <Pressable
                style={styles.rememberContainer}
                onPress={() => onChange(!value)}
              >
                <View style={styles.circle}>
                  {value && <View style={styles.checkedCircle} />}
                </View>
                <Text style={styles.rememberLabel}>Remember Me</Text>
              </Pressable>
            )}
          />

          <TouchableOpacity onPress={handleForgotButton}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <LinearGradient style={styles.button} colors={["#3659F4", "#3C82F2"]}>
          <Text style={styles.buttonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 20,
    marginTop: 25,
  },
  label: {
    fontSize: 17,
    fontFamily: "Inter",
    marginBottom: 8,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 15,
  },
  input: {
    borderRadius: 20,
    paddingVertical: 13,
    paddingHorizontal: 8,
    backgroundColor: "rgba(247, 254, 255, 0.1)",
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "medium",
    color: "rgba(247, 254, 255, 0.8)",
  },
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "red",
    marginBottom: 15,
    fontSize: 12,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    gap: 5,
  },
  circle: {
    width: 11,
    height: 11,
    borderRadius: 50 + "%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkedCircle: {
    width: 9,
    height: 9,
    borderRadius: 50 + "%",
    backgroundColor: "#3659F4",
  },
  rememberLabel: { fontSize: 12, color: "#fff", fontFamily: "Poppin" },

  forgotContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 6,
  },
  forgotText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Poppins",
  },
  button: {
    borderRadius: 50,
    padding: 13,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: "#fff",
    textAlign: "center",
  },
});
