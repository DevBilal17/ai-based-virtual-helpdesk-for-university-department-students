import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlassmorphismCard from '../../components/GlassmorphismCard/GlassmorphismCard'
import { Ionicons } from '@expo/vector-icons'
import ModuleBox from '../../components/Home/ModuleBox'
import HistoryChatBox from '../../components/Home/HistoryChatBox'

const {width,height} = Dimensions.get("window")
const index = () => {
  return (
    <ImageBackground source={require("../../assets/images/on-boarding-bg-1.png")} style={{flex:1}}>
      <SafeAreaView style={styles.container}>
        {/* Header View */}
        <View style={styles.headerViewContainer}>
          <TouchableOpacity>
          <GlassmorphismCard
            style={{ borderRadius: 20, height: 40, width: 40 }}
            gradientStyle={{
              height: 40,
              width: 40,
              paddingHorizontal: 0,
              paddingVertical: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="menu-outline" size={20} color="white" />
          </GlassmorphismCard>
        </TouchableOpacity>

         <View style={styles.onlineTextContainer}>
           <View style={styles.onlineCircle}></View>
           <Text style={styles.onlineText}>
            Online
           </Text>
         </View>

         <TouchableOpacity>
          <GlassmorphismCard
            style={{ borderRadius: 20, height: 40, width: 40 }}
            gradientStyle={{
              height: 40,
              width: 40,
              paddingHorizontal: 0,
              paddingVertical: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow:"hidden"
            }}
          >
            <Image source={require("../../assets/images/profile-img.png")} style={{
              flex:1
            }}   
            resizeMode='cover'
            />
          </GlassmorphismCard>
        </TouchableOpacity>
        </View>


        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Greeting View */}
        <View style={styles.greetingContainer}>
          <View style={styles.greetingNameTextContainer}>
            <Text style={styles.greetingText}>Hi, Ali</Text>
            <Image source={require("../../assets/icons/hand.png")} 
             style={{width:30,height:38}}
            />
          </View>
          <Text style={styles.greetingText}>How may I help you ?</Text>
        </View>


        {/* ModuleGrid View */}
        <View style={styles.moduleGridContainer}>
          <ModuleBox image={"speaking"} style={{height:250,width:width*0.5}} gradientColors={["#023E8A", "#011024"]} text={"Talk with Bot"}/>
          <View style={styles.moduleGridSubContainer}>
            <ModuleBox image={"communication"} style={{height:119}} gradientColors={["#48CAE4", "#48CAE4"]} 
            textStyle={{fontSize:16}}
            text={"Chat with bot"}
            />
            <ModuleBox image={"address"} style={{height:119}}  gradientColors={["#0077B6", "#0077B6"]}
            textStyle={{fontSize:16}}
            text={"Find Location"}
            />
          </View>
        </View>



        {/* History of Chats View */}
        <View style={styles.historyContainer}>
          <View style={styles.historyHeaderContainer}>
            <Text style={styles.historyHeaderTitle}>History</Text>
            <TouchableOpacity style={styles.showAll}>
              <Text style={styles.showAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          {/* Chat List */}
          <View style={{
            paddingVertical:10,
            gap:10,
            paddingBottom:30
          }}>
            <HistoryChatBox/>
            <HistoryChatBox/>
            <HistoryChatBox/>
            <HistoryChatBox/>
            <HistoryChatBox/>
            <HistoryChatBox/>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default index


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    flex: 1,
    paddingVertical: 20,
  },
  headerViewContainer : {
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    paddingBottom:20
  },
  onlineTextContainer:{
     display:"flex",
    flexDirection:"row",
    alignItems:"center",
    gap:5
  },
  onlineCircle:{
    height:4,
    width:4,
    borderRadius:2,
    backgroundColor:"#3971F3",

  },
  onlineText:{
    fontSize:12,
    fontFamily:"Roboto",
    color:"#C0C0C0"
  },


  // Greetings
  greetingContainer:{
    // paddingLeft:20,
    // marginTop:20
  },
  greetingNameTextContainer:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    gap:14
  },
  greetingText:{
    fontSize:24,
    color:"#fff",
    fontWeight:"medium"
  },


  // ModuleGrid View
  moduleGridContainer:{
    display:"flex",
    flexDirection:"row",
    // justifyContent:"space-between",
    height:250,
    width:420,
    gap:12,
    marginTop:20
    // backgroundColor:"red",
  },
  moduleGridSubContainer:{
    gap:12,
    width:width * 0.4 - 10
  },


  // History View
  historyContainer:{
    marginTop:10
  },
  historyHeaderContainer:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    // paddingHorizontal:20
  },
  historyHeaderTitle:{
    fontSize:20,
    color:"#fff",
    fontFamily:"Roboto",
  },
  showAllText:{
    fontSize:14,
     color:"#A29F9F",
    fontFamily:"Roboto",
  }
})