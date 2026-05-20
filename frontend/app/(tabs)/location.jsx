import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DeptMap from "../../components/Location/DeptMap";
import IndoorDeptMap from "../../components/Location/IndoorDeptMap";
import { Modal } from "react-native";

import BottomGestureBar from "../../components/Location/BottomGestureBar";

import {
  findPath,
  makeConnectionsBidirectional,
} from "../../utils/mapFunctions";
import { RAW_CONNECTIONS, ROOMS } from "../../utils/constants";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
export default function Location() {
  const [startRoom, setStartRoom] = useState(null);
  const [endRoom, setEndRoom] = useState(null);
  const { nodeId, intent } = useLocalSearchParams();
  const [showInfoModal, setShowInfoModal] = useState(false);
  console.log("Received Params:", { nodeId, intent });
  const CONNECTIONS = useMemo(() => {
    return makeConnectionsBidirectional(RAW_CONNECTIONS);
  }, []);
  const getRoomInfo = (doorNodeId) => {
    const room = ROOMS.find((r) => r.doorNodeId === doorNodeId);

    return {
      exists: !!room,
      roomId: room?.id,
      name: room?.name,
      floor: room?.floor,
    };
  };
  useEffect(() => {
    if (!nodeId) return;

    const roomInfo = getRoomInfo(nodeId);

    if (!roomInfo.exists) return;

    if (intent === "from") {
      setStartRoom(roomInfo.roomId);
    } else {
      setEndRoom(roomInfo.roomId);
      setStartRoom(null);
    }
  }, [nodeId, intent]);
  const route = useMemo(() => {
    if (startRoom && endRoom) {
      // Dono selected rooms ke complete objects dhoonden
      const startRoomObj = ROOMS.find((r) => r.id === startRoom);
      const endRoomObj = ROOMS.find((r) => r.id === endRoom);

      if (startRoomObj && endRoomObj) {
        // Agar doorNodeId mojud hai to wo use karein, nahi to fallback me room.id hi chala jaye
        const startNodeId = startRoomObj.doorNodeId || startRoomObj.id;
        const endNodeId = endRoomObj.doorNodeId || endRoomObj.id;

        return findPath(startNodeId, endNodeId, CONNECTIONS);
      }
    }
    return [];
  }, [startRoom, endRoom, CONNECTIONS]);

  const handleClearRoute = () => {
    setStartRoom(null);
    setEndRoom(null);
  };

  return (
    <View style={styles.container}>
      {/* MAP */}
      <IndoorDeptMap
        startRoom={startRoom}
        endRoom={endRoom}
        route={route}
        setStartRoom={setStartRoom}
        setEndRoom={setEndRoom}
      />

      {/* ACTIVATE BOTTOM GESTURE BAR  */}
      <BottomGestureBar
        startRoom={startRoom}
        endRoom={endRoom}
        onClear={handleClearRoute}
        setStartRoom={setStartRoom}
        setEndRoom={setEndRoom}
      />

      {/* HEADER */}
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>

          <View style={styles.centerContent}>
            <Text style={styles.smallText}>INDOOR NAVIGATION</Text>
            <Text style={styles.title}>Department Map</Text>
          </View>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setShowInfoModal(true)}
          >
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="white"
            />
          </TouchableOpacity>

          
        </View>
      </SafeAreaView>
      <Modal
  visible={showInfoModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowInfoModal(false)}
>
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPress={() => setShowInfoModal(false)}
  >
    <TouchableOpacity
      activeOpacity={1}
      style={styles.modalCard}
    >
      <View style={styles.modalHeader}>
        <Ionicons
          name="information-circle"
          size={26}
          color="#7C7CFF"
        />

        <Text style={styles.modalTitle}>
          Navigation Guide
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Ionicons name="radio-button-on" size={10} color="#7C7CFF" />

        <Text style={styles.infoText}>
          Select your starting location.
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Ionicons name="radio-button-on" size={10} color="#7C7CFF" />

        <Text style={styles.infoText}>
          Choose destination room or office.
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Ionicons name="radio-button-on" size={10} color="#7C7CFF" />

        <Text style={styles.infoText}>
          System automatically calculates shortest path.
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Ionicons name="radio-button-on" size={10} color="#7C7CFF" />

        <Text style={styles.infoText}>
          Tap outside this popup to close it.
        </Text>
      </View>
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    zIndex: 100,
  },
  header: {
    marginTop: 10,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(10,15,30,0.75)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  centerContent: {
    alignItems: "center",
  },
  smallText: {
    color: "#7C7CFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.65)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 24,
},

modalCard: {
  width: "100%",
  borderRadius: 28,
  padding: 22,

  backgroundColor: "rgba(18,25,45,0.95)",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},

modalHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
},

modalTitle: {
  color: "white",
  fontSize: 20,
  fontWeight: "700",
  marginLeft: 10,
},

infoItem: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 16,
},

infoText: {
  color: "rgba(255,255,255,0.8)",
  fontSize: 15,
  lineHeight: 22,
  marginLeft: 10,
  flex: 1,
},
});
