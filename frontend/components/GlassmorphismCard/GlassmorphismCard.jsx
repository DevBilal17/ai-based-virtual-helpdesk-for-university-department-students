import { View, Text, StyleSheet } from 'react-native'
import {BlurView} from "expo-blur"
import {LinearGradient} from "expo-linear-gradient"
import React from 'react'

const GlassmorphismCard = ({children}) => {
  return (
    <View style={[styles.container]}>
        <BlurView intensity={15} style={styles.glass}>
        <LinearGradient
          colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.02)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  )
}

export default GlassmorphismCard


const styles = StyleSheet.create({
    container : {
        maxWidth:408,
        width:100+"%",
        borderRadius:32,
        backgroundColor: 'rgba(247, 254, 255, 0.1)',
        // paddingHorizontal:32
        overflow:"hidden",
        height:"auto",
    }
    ,
  gradient: {

    paddingHorizontal: 16,
    paddingVertical:26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
})