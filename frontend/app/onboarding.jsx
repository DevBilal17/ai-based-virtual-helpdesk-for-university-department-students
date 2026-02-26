import { router } from "expo-router";
import { useState } from "react";
import Onboarding from "react-native-onboarding-swiper";
import DoneButtonComponent from "../components/onBoarding/DoneButtonComponent";
import Slide from "../components/onBoarding/Slide";
import { setItem } from "../utils/asyncStorage";
import { SafeAreaView } from "react-native-safe-area-context";
const onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleSkip = () => {
    setItem("onboardingCompleted", "true");
    router.replace("/login"); // ← use replace to prevent back navigation
  };
  const handleDone = () => {
    setItem("onboardingCompleted", "true");
     router.replace("/login"); // ← use replace to prevent back navigation
  };
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <Onboarding
      pageIndexCallback={(index) => setCurrentIndex(index)}
      onSkip={handleSkip}
      onDone={handleDone}
      containerStyles={{ padding: 0 }}
      titleStyles={{ display: "none" }}
      subTitleStyles={{ display: "none" }}
      imageContainerStyles={{ paddingBottom: 0 }}
      DoneButtonComponent={DoneButtonComponent}
      bottomBarColor="#0d0b20"
      bottomBarHighlight={false}
      pages={[
        {
          backgroundColor: "transparent",
          image: (
            <Slide
              bg={require("../assets/images/on-boarding-bg-1.png")}
              img={require("../assets/images/onboarding-1.png")}
              title="Ask AI Helpdesk"
              subtitle="Get instant answers to academic queries"
              active={currentIndex === 0}
            />
          ),
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "transparent",
          image: (
            <Slide
              bg={require("../assets/images/on-boarding-bg-1.png")}
              img={require("../assets/images/onboarding-2.png")}
              title="Voice Assistant"
              subtitle="Speak your question, get instant reply"
              active={currentIndex === 1}
            />
          ),
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "transparent",
          image: (
            <Slide
              bg={require("../assets/images/on-boarding-bg-3.png")}
              img={""}
              title="Find Locations"
              subtitle="Scan QR to locate labs & offices"
              active={currentIndex === 2}
            />
          ),
          title: "",
          subtitle: "",
        },
      ]}
    />
    </SafeAreaView>
  );
};

export default onboarding;
