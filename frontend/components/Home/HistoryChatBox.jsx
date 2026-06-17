import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'


const {width,height} = Dimensions.get("window")
const HistoryChatBox = ({title,message,date}) => {
  const formatMessage = (text) => {
  if (!text) return "";
  return text.length > 35 ? text.slice(0, 35) + "..." : text;
};
 const formatTitle = (text) => {
  if (!text) return "";
  return text.length > 20 ? text.slice(0, 20) + "..." : text;
};
// console.log(date)
title=formatTitle(title)
message=formatMessage(message)
  return (
    <View style={{width:width*0.92,
    paddingHorizontal:16,paddingVertical:18,display:"flex",flexDirection:"row",alignItems:"center",borderRadius:10}}>
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
          }>{title}</Text>
          <Text
          style={
            {
                fontSize:12,
                fontFamily:"Roboto",
                color:"#DEDDDD"
            }
          }
          >{message}</Text>
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
           <View>
             <Text style={
                {
                    fontSize:12,
                    color:"#DEDDDD",
                      textAlign:"center"
                }
            }>{date?.hours}:{date?.minutes} {date?.ampm}</Text>
            <Text style={
                {
                    fontSize:11,
                    color:"#DEDDDD",
                    textAlign:"center"
                }
            }>{date?.day}/{date?.month}/{date?.year}</Text>
           </View>
            <Ionicons name='chevron-forward' size={20} color={"white"} />
          </View>
          {/* <Image source={require("../../assets/icons/more-horizontal.png")} style={{
            marginLeft:"auto",
          }} /> */}
       </View>
    </View>
  )
}

export default HistoryChatBox
