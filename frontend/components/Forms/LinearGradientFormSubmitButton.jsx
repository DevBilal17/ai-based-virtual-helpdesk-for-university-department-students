import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const LinearGradientFormSubmitButton = ({
  handleSubmit,
  onSubmit,
  style,
  text,
}) => {
  return (
    <TouchableOpacity onPress={handleSubmit(onSubmit)}>
      <LinearGradient
        style={[styles.button, style]}
        colors={["#3659F4", "#3C82F2"]}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default LinearGradientFormSubmitButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: "#fff",
    textAlign: "center",
  },
});
