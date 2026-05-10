import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const GlassmorphismInput = ({
  onChange,
  onBlur,
  value,
  style,
  keyboardType,
  placeholder,
  iconName,
  iconColor,
  autoCapitalize = "none",
  isPassword = false,
  isTouchable,
  onTouchableIconPress,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const getIconColor = () => {
    if (iconColor) return iconColor; // Use passed color (e.g., Red for recording)
    if (value?.length > 0) return "#635BFF"; // Brand Purple when text exists
    return "white";
  };
  return (
    <View style={[styles.container, isFocused && styles.focusedContainer]}>
      <BlurView intensity={25} style={styles.glass}>
        <LinearGradient
          colors={
            isFocused
              ? ["rgba(99, 91, 255, 0.2)", "rgba(28, 45, 71, 0.3)"] // Subtle glow when typing
              : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.02)"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient]}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, style]}
              placeholder={placeholder}
              placeholderTextColor={"rgba(247, 254, 255, 0.5)"}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              onBlur={() => {
                onBlur?.();
                setIsFocused(false);
              }}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              value={value}
              secureTextEntry={isPassword && !showPassword}
              multiline={isPassword ? false : true} // Allow long prompts
              maxLength={500}
            />

            <View style={styles.iconGroup}>
              {/* Password Toggle */}
              {isPassword && (
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.iconButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="white"
                  />
                </TouchableOpacity>
              )}

              {/* Action Icon (Send/Mic) */}
              {iconName && (
                <TouchableOpacity
                  disabled={!isTouchable}
                  onPress={onTouchableIconPress}
                  style={[
                    styles.iconButton,
                    value?.length > 0 && isTouchable && styles.activeSendIcon,
                  ]}
                >
                  <Ionicons name={iconName} size={24} color={getIconColor()} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 25,
    backgroundColor: "rgba(247, 254, 255, 0.05)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  focusedContainer: {
    // Solid color ki jagah brand purple ka subtle glow
    // backgroundColor: "rgba(99, 91, 255, 0.1)", 
    borderColor: "rgba(99, 91, 255, 0.5)", // Purple border glow
    borderWidth: 1.5,
    // Soft shadow (iOS only, for Android elevation focus works differently)
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  gradient: {
    minHeight: 50,
    maxHeight: 120, // Prevents input from taking over the screen
    justifyContent: "center",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end", // Aligns icons to bottom when text expands
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 15,
    color: "#fff",
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 0 : 5,
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5, // Align with bottom of text
  },
  iconButton: {
    marginLeft: 10,
    padding: 4,
  },
  activeSendIcon: {
    transform: [{ scale: 1.1 }],
  },
});

export default GlassmorphismInput;
