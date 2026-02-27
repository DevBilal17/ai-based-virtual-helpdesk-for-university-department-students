import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlassmorphismCard from '../../components/GlassmorphismCard/GlassmorphismCard'
import { Ionicons } from '@expo/vector-icons'
import MessageBox from '../../components/Chat/MessageBox'
import { Controller, useForm } from 'react-hook-form'
import { router } from 'expo-router'

const chat = () => {
  const {control} = useForm()
  const handleVoicePress = ()=>{

  }
  return (
    <SafeAreaView style={[styles.container]}>
      {/* Header View */}
        <View style={styles.headerViewContainer}>
          <TouchableOpacity style={{
            position:"absolute",
            left:0
          }}>
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
            <Ionicons name="arrow-back" size={20} color="white" />
          </GlassmorphismCard>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          AI Desk Helper
        </Text>
        </View>

        {/* Message Scroller */}
        <ScrollView contentContainerStyle={{
          gap:20,
          paddingBottom: 30
        }}>
          <MessageBox isUser={true} image={require("../../assets/images/profile-img.png")} 
          question={"Hi..."}
          />
          <MessageBox isUser={false} image={require("../../assets/icons/message-bot.png")}
          answer={"Hello 👋"}
          />
          <MessageBox isUser={true} image={require("../../assets/images/profile-img.png")} 
          question={"Hi..."}
          />
          <MessageBox isUser={false} image={require("../../assets/icons/message-bot.png")}
          answer={"Hello 👋"}
          />
          <MessageBox isUser={true} image={require("../../assets/images/profile-img.png")} 
          question={"What is the attendance policy?"}
          />
          <MessageBox isUser={false} image={require("../../assets/icons/message-bot.png")}
          answer={"✅ According to IT Department rules, students must maintain at least 75% attendance in each subject to be eligible for exams. Would you like details about attendance shortage fines or condonation rules?"}
          />
          <MessageBox isUser={true} image={require("../../assets/images/profile-img.png")} 
          question={"Hi..."}
          />
          <MessageBox isUser={false} image={require("../../assets/icons/message-bot.png")}
          answer={"Hello 👋"}
          />
          
        </ScrollView>


        {/* Input */}
        {/* Not Implemented yet */}
        <View style={{
          paddingBottom:30,
          paddingTop:10,
          flexDirection:"row",
          justifyContent:"space-between"
        }}>
          <Text style={{
            fontSize:30,
            color:"#fff"
          }}>Input</Text>
          <TouchableOpacity >
            <Text style={{
            fontSize:30,
            color:"#fff"
          }}>Voice</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default chat

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    flex: 1,
    paddingVertical: 20,
    backgroundColor:"#0C1013",
    color:"#fff"
  },

    headerViewContainer : {
    position:"relative",

    paddingBottom:20,
  },

  headerTitle:{
    color:"#fff",
    textAlign:"center",
    fontSize:24
  }
})