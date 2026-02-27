import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'


const {width,height} = Dimensions.get("window")
const HistoryChatBox = () => {
  return (
    <View style={{width:width*0.92,
    height:90,backgroundColor:"#353539",paddingHorizontal:12,paddingVertical:18,display:"flex",flexDirection:"row",alignItems:"center",borderRadius:10}}>
       <Ionicons name="chatbubble-outline" size={40} color={"white"} />
       <View style={
        {
            justifyContent:"space-between",
            marginLeft:16,
            gap:10
        }
       }>
          <Text style={
            {
                fontSize:20,
                fontFamily:"Roboto",
                color:"#DEDDDD"
            }
          }>Lab Location</Text>
          <Text
          style={
            {
                fontSize:12,
                fontFamily:"Roboto",
                color:"#DEDDDD"
            }
          }
          >Best 2026 mobile app suggestion ....</Text>
       </View>
       
       <View
       style={
        {
            justifyContent:"space-between",
            marginLeft:"auto",
            gap:10
        }
       }
       >
          <View style={
            {
                flexDirection:"row",
                alignItems:"center",
                gap:8
            }
          }>
            <Text style={
                {
                    fontSize:13,
                    color:"#DEDDDD"
                }
            }>22:10</Text>
            <Ionicons name='chevron-forward' size={20} color={"white"} />
          </View>
          <Image source={require("../../assets/icons/more-horizontal.png")} style={{
            marginLeft:"auto",
          }} />
       </View>
    </View>
  )
}

export default HistoryChatBox
