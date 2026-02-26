import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import Slide from '../components/onBoarding/Slide';
import GradientBottomBar from '../components/onBoarding/GradientBottomBar';
import DoneButtonComponent from '../components/onBoarding/DoneButtonComponent';
import { useNavigation, useRouter } from 'expo-router';
const onboarding = () => {
    const [currentIndex,setCurrentIndex] = useState(0)
    const router = useRouter()
    const handleSkip = ()=>{
        router.push("/login")
    }
    const handleDone = ()=>{
        router.push("/login")
    }
  return (
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
              img = {require("../assets/images/onboarding-1.png")}
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
              img = {require("../assets/images/onboarding-2.png")}
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
              img = {''}
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
  )
}

export default onboarding