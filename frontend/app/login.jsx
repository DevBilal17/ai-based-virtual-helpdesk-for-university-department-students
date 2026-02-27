import { View, Text, TouchableOpacity, ImageBackground, StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { removeItem } from '../utils/asyncStorage'
import { useNavigation, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlassmorphismCard from '../components/GlassmorphismCard/GlassmorphismCard'
import LoginForm from '../components/Forms/LoginForm'

const login = () => {
  const navigation = useNavigation();
  const handleReset = async() => {
    await removeItem("onboardingCompleted");
    navigation.navigate("onboarding");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
       <ImageBackground source={require("../assets/images/on-boarding-bg-1.png")} style={[styles.container,{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
         <StatusBar barStyle="light-content" />
          <View style={{marginBottom:40}}>
            <Text style={styles.headTitle}>Hi, Welcome Here!</Text>
            <Text style={styles.headSubtitle}>Please enter your email adress and password.</Text>
          </View>
          <GlassmorphismCard>
            <Text style={styles.loginText}>Login</Text>
            <LoginForm/>
          </GlassmorphismCard>
       </ImageBackground>
    </SafeAreaView>
  )
}

export default login


const styles = StyleSheet.create({
  container : {
     paddingHorizontal:20,
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

})