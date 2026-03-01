import React, { useEffect } from "react";
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
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { setItem } from "../../utils/asyncStorage";
import { useLoginMutation } from "../../store/services/authApi";
import Toast from 'react-native-toast-message';

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues:{
      registrationNumber:"",
      password:""
    }
  });

  const [login, { isLoading, error }] = useLoginMutation();
  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);

      // Call backend
      const response = await login(data).unwrap();

      // Save token in AsyncStorage
      await setItem("token", response.data.token);
      await User("user",response.data.user)
      await setItem("loggedIn", "true");

      console.log("Login Success");
      Toast.show({
  type: 'success',
  text1: 'Login Successful',
  text2: 'Welcome back!',
});
      // Navigate to home screen
      router.replace("/(tabs)");
    } catch (err) {
      console.log("Login Failed ", err?.data?.message);
  //     Toast.show({
  //    type: 'error',
  //    text1: 'Login Failed',
  //    text2: err?.data?.message || 'Something went wrong',
  //  });
   Toast.show({
  type: 'error',
  position: 'top',
  visibilityTime: 3000,
  autoHide: true,
  text1: 'Login Failed',
  text2: err?.data?.message || 'Something went wrong',
});
    }
  };
  const navigation = useNavigation();
  const handleForgotButton = () => {
    navigation.navigate("resetpassword");
  };

  return (
    <View style={styles.container}>
      <View>
        {/* Registration Number */}
        <Text style={styles.label}>Registration Number</Text>
        <Controller
          control={control}
          name="registrationNumber"
          rules={{
            required: "Registration number is required",
            pattern: {
              value: /^\d{4}-[A-Z]+-\d{5}$/i,
              message: "Format must be 2022-GCUF-02661",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, { paddingHorizontal: 15 }]}
              placeholder="Enter registration number"
              placeholderTextColor={"#F7FEFF99"}
              autoCapitalize="characters" // automatically uppercase
              onBlur={onBlur}
              onChangeText={(text) => onChange(text.toUpperCase())} // force uppercase
              value={value}
            />
          )}
        />

        {errors.registrationNumber && (
          <Text style={styles.error}>{errors.registrationNumber.message}</Text>
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

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        style={{ opacity: isLoading ? 0.7 : 1 }}
      >
        <LinearGradient style={styles.button} colors={["#3659F4", "#3C82F2"]}>
          <Text style={styles.buttonText}>
            {isLoading ? "Logging in..." : "Login"}
          </Text>
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
