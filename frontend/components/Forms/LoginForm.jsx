import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import { removeItem, setItem } from "../../utils/asyncStorage";
import { useLoginMutation } from "../../store/services/authApi";
import Toast from "react-native-toast-message";
import GlassmorphismInput from "./GlassmorphismInput";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      registrationNumber: "",
      password: "",
      remember: false,
    },
  });

  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);

      // Call backend
      const response = await login(data).unwrap();
      console.log(response)
      // Save token in AsyncStorage
      await setItem("token", response.data.token);
      await setItem("user", JSON.stringify(response?.data?.user));
      if (data.remember) {
        await setItem("loggedIn", "true");
      } else {
        await removeItem("loggedIn");
      }
      // redux state
      dispatch(
        setCredentials({
          user: response?.data?.user,
          token: response.data.token,
        }),
      );
      console.log("Login Success");
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
      });
      // Navigate to home screen
      router.replace("/");
    } catch (err) {
      console.log(err);
      console.log("Login Failed ", err?.data?.message);

      Toast.show({
        type: "error",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        text1: "Login Failed",
        text2: err?.data?.message || "Something went wrong",
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
            <GlassmorphismInput
              onChange={(text) => onChange(text.toUpperCase())}
              placeholder={"Enter registration number"}
              autoCapitalize="characters"
              onBlur={onBlur}
              value={value}
              iconName={"card-outline"}
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
            <GlassmorphismInput
              isPassword={true}
              placeholder="Enter your password"
              onBlur={onBlur}
              onChange={onChange}
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
        <LinearGradient style={styles.button} colors={["#635BFF", "#1C2D47"]}>
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
    gap: 22,
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    marginLeft: 5,
    opacity: 0.7,
  },

  error: {
    color: "#FF4C45",
    fontSize: 13,
    marginTop: 5,
    marginLeft: 5,
  },

  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  checkedCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#635BFF",
  },

  rememberLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },

  forgotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 5,
  },

  forgotText: {
    fontSize: 13,
    color: "#635BFF",
    fontWeight: "600",
  },

  button: {
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
