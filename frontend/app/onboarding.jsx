import { View, Text, Image } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import Slide from '../components/onBoarding/Slide';
import GradientBottomBar from '../components/onBoarding/GradientBottomBar';
import DoneButtonComponent from '../components/onBoarding/DoneButtonComponent';
const onboarding = () => {
  return (
     <Onboarding
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