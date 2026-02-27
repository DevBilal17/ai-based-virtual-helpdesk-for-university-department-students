import { View, Text, StyleSheet, TextInput } from 'react-native'
import {BlurView} from "expo-blur"
import {LinearGradient} from "expo-linear-gradient"
import React from 'react'

const GlassmorphismInput = ({onChange,onBlur,value,style,keyboardType,placeholder}) => {
  return (
    <View style={[styles.container]}>
            <BlurView intensity={15} style={styles.glass}>
            <LinearGradient
              colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.02)"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.gradient]}
            >
              <View style={styles.inputContainer}>
                <TextInput
                                      style={[
                                        styles.input,
                                        
                                      ]}
                                      placeholder={placeholder}
                                      placeholderTextColor={"#F7FEFF99"}
                                      keyboardType={keyboardType}
                                      autoCapitalize="none"
                                      onBlur={onBlur}
                                      onChangeText={onChange}
                                      value={value}
                                    />
                                    <Text>
                                        Icon
                                    </Text>
              </View>
            </LinearGradient>
          </BlurView>
    </View>
  )
}

export default GlassmorphismInput

const styles = StyleSheet.create({
    container : {
        maxWidth:408,
        width:100+"%",
        borderRadius:50,
        backgroundColor: 'rgba(247, 254, 255, 0.1)',
        overflow:"hidden",
        height:"auto",
    }
    ,
  gradient: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  inputContainer:{
     display:"flex",
     flexDirection:"row",
     alignItems:"center",
     justifyContent:"space-between",
     gap:5,
     paddingHorizontal:14,
  },
  input: {
    fontFamily:"Roboto",
    fontSize:15,
    fontWeight:"medium",
    color:"#fff"
  },
})