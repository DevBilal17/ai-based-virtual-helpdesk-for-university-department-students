import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const TabLayout = () => {
   const insets = useSafeAreaInsets();
  return (
    <Tabs
      initialRouteName='location'

      screenOptions={({ route }) => ({
        headerShown: false,
        detachInactiveScreens: true,
        tabBarHideOnKeyboard: true, // Pro tip: hide bar when typing in chat
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          let size = focused ? 30 : 26; // Dynamic size for better feedback

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "chat") {
            iconName = focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline";
          } 
          else if (route.name === "voice") {
            iconName = focused ? "mic" : "mic-outline";
          }
          else if (route.name === "location") {
            iconName = focused ? "location" : "location-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Modern AI Color Palette
        tabBarActiveTintColor: "#6764F2", // Electric Cyan/Mint for AI vibe
        tabBarInactiveTintColor: "#8e8e93",
        
        tabBarStyle: {
          // position: "absolute",
          // bottom: Platform.OS === 'ios' ? 25 : 15, // Floating effect
          // left: 20,
          // right: 20,
          backgroundColor: "rgba(28, 29, 30, 0.95)", // Slightly transparent
          height: 65 + insets.bottom,   
          // borderRadius: 35,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          paddingBottom: insets.bottom, // Centers icons better in floating bar
        },
        tabBarItemStyle: {
          margin: 10,
        },
        tabBarShowLabel: false,
      })}
      // Add Haptic Feedback on change
      screenListeners={{
        state: () => {
          if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
          }
        },
      }}
    >
      {/* Hide the voice tab from the bottom bar */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="voice"  />
      <Tabs.Screen name="location" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

export default TabLayout;