import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const GlassAlertModal = ({
  visible,
  title,
  message,
  icon,
  primaryText,
  secondaryText,
  onPrimaryPress,
  onSecondaryPress,
  onClose,
  primaryColor = "#635BFF",
  danger = false,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <BlurView intensity={30} style={styles.blur}>
          <View style={styles.card}>
            {icon}

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.btnRow}>
              {secondaryText && (
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#1C2D47" }]}
                  onPress={onSecondaryPress}
                >
                  <Text style={styles.btnText}>{secondaryText}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={onPrimaryPress} style={{ flex: 1 }}>
                <LinearGradient
                  colors={
                    danger
                      ? ["#EF4444", "#991B1B"]
                      : [primaryColor, "#1C2D47"]
                  }
                  style={styles.btn}
                >
                  <Text style={styles.btnText}>{primaryText}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Modal>
  );
};

export default GlassAlertModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  blur: {
    width: "85%",
    borderRadius: 20,
    overflow: "hidden",
  },

  card: {
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },

  message: {
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
  },

  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});