import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Onboarding from "react-native-onboarding-swiper";

const GradientBottomBar = ({ ...props }) => {
  return (
    <LinearGradient
      colors={["#023E8A", "#011024"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        height: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
      }}
    >
      {props.SkipButtonComponent}
      {props.NextButtonComponent}
    </LinearGradient>
  );
};

export default function OnboardingScreen({ navigation }) {
  return (
    <Onboarding
      BottomBarHighlight={false}
      bottomBarColor="transparent"
      BottomBarComponent={GradientBottomBar}
      onDone={() => navigation.replace("Login")}
      onSkip={() => navigation.replace("Login")}
      pages={[
        {
          backgroundColor: "#fff",
          image: <View />,
          title: "Title",
          subtitle: "Subtitle",
        },
      ]}
    />
  );
}
