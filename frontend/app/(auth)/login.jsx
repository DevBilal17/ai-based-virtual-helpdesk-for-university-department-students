import { View, Text, TouchableOpacity, ImageBackground, StatusBar, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getItem, removeItem } from '../../utils/asyncStorage'
import { Redirect, useNavigation, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlassmorphismCard from '../../components/GlassmorphismCard/GlassmorphismCard'
import LoginForm from '../../components/Forms/LoginForm'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'

const login = () => {
  const [isLoggedIn,setIsLoggedIn] = useState(false)

  useEffect(()=>{
    checkLoggedInStatus()
  },[])

const checkLoggedInStatus = async () => {
  const status = await getItem("loggedIn");

  if (status === "true") {
    setIsLoggedIn(true);
  } else {
    setIsLoggedIn(false);
  }
};

  const navigation = useNavigation();
  const handleReset = async() => {
    await removeItem("onboardingCompleted");
    navigation.navigate("onboarding");
  };
   
  if(isLoggedIn){
    return <Redirect href={'/(tabs)'} />
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
       <ImageBackground source={require("../../assets/images/on-boarding-bg-1.png")} style={[styles.container,{  }]}>
         <StatusBar barStyle="light-content" />
          <View style={{marginBottom:40}}>
            <Text style={styles.headTitle}>Hi, Welcome Here!</Text>
            <Text style={styles.headSubtitle}>Please enter your email adress and password.</Text>
          </View>
          
        
            <View style={[styles.fContainer]}>
      <BlurView intensity={15} style={styles.glass}>
        <LinearGradient
          colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.02)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.fGradient]}
        >
          <Text style={styles.loginText}>Login</Text>
              <LoginForm/>
        </LinearGradient>
      </BlurView>
    </View>
          
       </ImageBackground>
    </SafeAreaView>
  )
}

export default login

const styles = StyleSheet.create({
  container : {
     paddingHorizontal:20,
     flex: 1, alignItems: 'center',justifyContent:"center"
  },
  headTitle : {
    fontSize:40,
    fontWeight:"bold",
    fontFamily:"Roboto",
    color:"#fff",
    textAlign:"center",
    lineHeight : 50
  },
  headSubtitle : {
    fontSize:16,
    fontFamily:"Roboto",
    color:"#C8CACD",
    textAlign:"center",
    lineHeight : 50
  },

  loginText:{
    fontFamily:"Roboto",
    fontSize:24,
    fontWeight:"bold",
    color:"#F7FEFF",
    textAlign:"center",
  }
,
fContainer: {
    maxWidth: 408,
    width: 100 + "%",
    borderRadius: 32,
    backgroundColor: "rgba(247, 254, 255, 0.1)",
    // paddingHorizontal:32
    overflow: "hidden",
    height: "auto",
  },
  fGradient: {
    paddingHorizontal: 16,
    paddingVertical: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
})