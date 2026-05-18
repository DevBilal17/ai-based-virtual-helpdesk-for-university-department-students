import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Audio } from "expo-av";
import { useFocusEffect, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
const SCAN_BOX_SIZE = 250;

export default function QrScanner() {
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // 🔴 LASER ANIMATION
  const translateY = useRef(new Animated.Value(0)).current;
  useFocusEffect(
    useCallback(() => {
      setScanned(false);
    }, []),
  );
  // 🔥 REQUEST PERMISSION
  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();
  }, [permission]);

  // 🔥 LASER LOOP ANIMATION
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: SCAN_BOX_SIZE,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // 🔊 BEEP SOUND
  const playBeep = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/beep.mp3"),
      );
      await sound.playAsync();
    } catch (e) {
      console.log("Sound error:", e);
    }
  };

  // 📷 SCAN HANDLER
  const handleBarcodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    // vibration
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    await playBeep();

    try {
      const url = new URL(data);

      const nodeId = url.searchParams.get("nodeId");
      const intent = url.searchParams.get("intent");

      if (!nodeId) return;

      router.push({
        pathname: "(tabs)/location",
        params: { nodeId, intent },
      });
    } catch (err) {
      console.log("Invalid QR");
    }

    setTimeout(() => setScanned(false), 2000);
  };

  // ❌ PERMISSION UI
  if (!permission) {
    return <View style={styles.center} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Camera permission needed</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CAMERA */}
      <View style={StyleSheet.absoluteFillObject}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        />
      </View>

      {/* OVERLAY */}
      <View style={styles.overlay}>
        {/* SCAN BOX */}
        <View style={styles.scanBox}>
          {/* LASER */}
          <Animated.View
            style={[
              styles.laser,
              {
                transform: [{ translateY }],
              },
            ]}
          />
        </View>

        <Text style={styles.text}>
          {scanned ? "Beep! Scanned ✔" : "Align QR inside frame"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050816",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  scanBox: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#635BFF",
    overflow: "hidden",
    justifyContent: "flex-start",
  },

  laser: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 3,
    backgroundColor: "#00F5D4",
    shadowColor: "#00F5D4",
    shadowOpacity: 1,
    shadowRadius: 10,
    opacity: 0.9,
  },

  text: {
    color: "white",
    marginTop: 20,
    fontSize: 14,
  },
});
