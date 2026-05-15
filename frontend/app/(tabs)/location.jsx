import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import IndoorMap from "../../components/Location/IndoorMap";

const { height } = Dimensions.get("window");

const LOCATIONS = [
  { id: "entrance", name: "Main Entrance", icon: "exit-outline" },
  { id: "hod", name: "HOD Office", icon: "briefcase-outline" },
  { id: "lab", name: "Computer Lab", icon: "laptop-outline" },
  { id: "lecture1", name: "Lecture Hall 101", icon: "school-outline" },
  { id: "lecture2", name: "Lecture Hall 102", icon: "school-outline" },
  { id: "lecture3", name: "Lecture Hall 103", icon: "school-outline" },
  { id: "library", name: "Library", icon: "book-outline" },
  { id: "washroom", name: "male-female-outline" },
];

export default function Location() {
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["25%", "60%"], []);

  const [start, setStart] = useState("entrance");
  const [end, setEnd] = useState("lecture3");

  const [activeField, setActiveField] = useState("end");
  const [isNavigating, setIsNavigating] = useState(false);

  const getName = (id) =>
    LOCATIONS.find((l) => l.id === id)?.name || id;

  // ✅ FIXED: open sheet properly
  const openSheet = (field) => {
    setActiveField(field);
    bottomSheetRef.current?.snapToIndex(1);
  };

  // ✅ FIXED: correct selection logic
  const selectLocation = (id) => {
    if (activeField === "start") {
      setStart(id);
    } else {
      setEnd(id);
    }

    bottomSheetRef.current?.snapToIndex(0);
  };

  // ✅ FIXED: toggle navigation bug
  const toggleNavigation = () => {
    const next = !isNavigating;
    setIsNavigating(next);

    if (next) {
      bottomSheetRef.current?.collapse();
    } else {
      bottomSheetRef.current?.snapToIndex(1);
    }
  };

  return (
    <View style={styles.container}>

      {/* MAP */}
      <IndoorMap
        start={start}
        end={end}
        locations={LOCATIONS}
        isNavigating={isNavigating}
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

          <View>
            <Text style={styles.smallText}>INDOOR NAVIGATION</Text>
            <Text style={styles.title}>Department Map</Text>
          </View>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* BOTTOM SHEET */}
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={{ backgroundColor: "#666" }}
      >
        <BottomSheetView style={styles.sheetContent}>

          {/* ROUTE */}
          <View style={styles.routeCard}>
            <Text style={styles.routeLabel}>Current Route</Text>
            <Text style={styles.routeText}>
              {getName(start)} → {getName(end)}
            </Text>
          </View>

          {/* FROM / TO */}
          <View style={styles.selectRow}>

            <TouchableOpacity
              style={[
                styles.selectBox,
                activeField === "start" && styles.activeBox,
              ]}
              onPress={() => openSheet("start")}
            >
              <Text style={styles.selectLabel}>FROM</Text>
              <Text style={styles.selectValue}>{getName(start)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selectBox,
                activeField === "end" && styles.activeBox,
              ]}
              onPress={() => openSheet("end")}
            >
              <Text style={styles.selectLabel}>TO</Text>
              <Text style={styles.selectValue}>{getName(end)}</Text>
            </TouchableOpacity>

          </View>

          {/* NAV BUTTON */}
          <TouchableOpacity
            style={[
              styles.navBtn,
              { backgroundColor: isNavigating ? "#E11D48" : "#635BFF" },
            ]}
            onPress={toggleNavigation}
          >
            <MaterialCommunityIcons
              name={isNavigating ? "close" : "navigation"}
              size={22}
              color="white"
            />
            <Text style={styles.navBtnText}>
              {isNavigating ? "Stop Navigation" : "Start Navigation"}
            </Text>
          </TouchableOpacity>

          {/* LOCATION LIST */}
          <BottomSheetScrollView
  contentContainerStyle={styles.listContent}
  showsVerticalScrollIndicator={false}
>
            {!isNavigating &&
              LOCATIONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.item}
                  onPress={() => selectLocation(item.id)}
                >
                  <View style={styles.iconCircle}>
                    <Ionicons name={item.icon} size={16} color="white" />
                  </View>
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
          </BottomSheetScrollView>

        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

/* ================= STYLES ================= */

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
    paddingHorizontal: 20,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  smallText: {
    color: "#635BFF",
    fontSize: 10,
    fontWeight: "700",
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  sheetBackground: {
    backgroundColor: "#0E1324",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  sheetContent: {
    padding: 20,
    gap: 14,
  },

  routeCard: {
    backgroundColor: "#141B34",
    padding: 14,
    borderRadius: 16,
  },

  routeLabel: {
    color: "#00F5D4",
    fontSize: 12,
    fontWeight: "700",
  },

  routeText: {
    color: "white",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "600",
  },

  selectRow: {
    flexDirection: "row",
    gap: 10,
  },

  selectBox: {
    flex: 1,
    backgroundColor: "#141B34",
    padding: 14,
    borderRadius: 14,
  },

  activeBox: {
    borderWidth: 1,
    borderColor: "#635BFF",
  },

  selectLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    fontWeight: "700",
  },

  selectValue: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  navBtn: {
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },

  navBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },

 listContent: {
  paddingTop: 10,
  paddingBottom: 40,
},

  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#141B34",
    borderRadius: 12,
    marginBottom: 8,
  },

  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  itemText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
});