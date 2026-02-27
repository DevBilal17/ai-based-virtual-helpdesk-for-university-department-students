import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, StatusBar, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlassmorphismCard from '../components/GlassmorphismCard/GlassmorphismCard'
import { useForm, Controller } from "react-hook-form";
import GlassmorphismInput from '../components/Forms/GlassmorphismInput';
import LinearGradientFormSubmitButton from '../components/Forms/LinearGradientFormSubmitButton';
const ResetPassword = () => {
   const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm();
  
    const onSubmit = (data) => {
      console.log("Form Data:", data);
  };
  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar/>
      <ImageBackground
        source={require("../assets/images/on-boarding-bg-1.png")}
        style={styles.container}
      >
        {/* Back Button */}
        <TouchableOpacity>
          <GlassmorphismCard style={{borderRadius:20,height :40,width:40}}>
              
          </GlassmorphismCard>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>To reset your password enter your email and we’ll send you an OTP code.</Text>
        </View>
        
        {/* Reminder! Replace Later with Email Input Component */}
        <View style={styles.formContainer}>
                  {/* EMAIL */}
                <Text style={styles.label}>Email</Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <GlassmorphismInput onChange={onChange} onBlur={onBlur} value={value} placeholder={"Enter your email"} style={{}} />
                  )}
                />
                {errors.email && (
                  <Text style={styles.error}>{errors.email.message}</Text>
                )}
              </View>
              <LinearGradientFormSubmitButton  handleSubmit={handleSubmit} onSubmit={onSubmit} text={"Continue"} style={{marginTop:20}}/>
        
      </ImageBackground>
    </SafeAreaView>
  )
}

export default ResetPassword


const styles = StyleSheet.create({
   container : {
     paddingHorizontal:14,
     flex: 1,
     paddingVertical:20
  },
  titleContainer:{
    paddingLeft:14,
    marginTop:40,
  },
  title:{
     fontWeight:"bold",
     color:"#fff",
     fontSize:32,
    //  lineHeight:22,
     fontFamily:"Roboto",
     textAlign:"left"
  },
  subtitle:{
    fontSize:16,
    fontFamily:"Roboto",
    lineHeight:22,
    color:"#C8CACD",
    textAlign:"left"
  },
  formContainer:{
    marginTop:40,
  },
  label: {
    fontSize: 17,
    fontFamily:"Inter",
    marginBottom: 8,
    fontWeight: "600",
    color:"#ffffff",
    marginLeft:15
  },
})