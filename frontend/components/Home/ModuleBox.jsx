import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const {width,height} = Dimensions.get("window")
const ModuleBox = ({style,textStyle,image,text,gradientColors = ["#023E8A", "#011024"]}) => {
const icons = {
  speaking: require("../../assets/icons/speaking.png"),
  communication: require("../../assets/icons/communication.png"),
  address: require("../../assets/icons/address.png"),
};
  return (
    <TouchableOpacity style={[styles.container,style]}>
      <LinearGradient
      style={
        [styles.gradientContainer]
      }
        colors={gradientColors}
      >
       {/* Header View */}
       <View style={styles.headerView}>
         <Image source={icons[image]}/>

         <Image source={require("../../assets/icons/arrow-up-right.png")}/>
       </View>
       <Text style={[styles.moduleText,textStyle]}>
        {text}
       </Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

export default ModuleBox

const styles = StyleSheet.create({
    container:{
        maxHeight:250,
        borderRadius:20,
    },
    gradientContainer:{
        flex:1,
        borderRadius:20,
        paddingTop:17,
        paddingHorizontal:14,
        justifyContent:"space-between",
        paddingBottom:24
    },

    headerView:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    moduleText:{
      fontSize:24,
      color:"#fff",
      fontWeight:"medium",
      fontFamily:"Roboto"
    }
    
})