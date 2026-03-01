import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassmorphismCard from "../components/GlassmorphismCard/GlassmorphismCard";
import { Ionicons } from "@expo/vector-icons";
import MessageBox from "../components/Chat/MessageBox";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import GlassmorphismInput from "../components/Forms/GlassmorphismInput";
import TypingBubble from "../components/Chat/TypingBubble";
const chat = () => {
  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      message: "",
    },
  });
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messageValue = watch("message");
  const onSubmit = (data) => {
    if (data?.message.trim() == "") return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: data.message,
    };

    setMessages((prev) => [userMessage, ...prev]);
    reset();

   // Show typing indicator
  setIsBotTyping(true);

  setTimeout(() => {
    setIsBotTyping(false);

    const botReply = {
      id: Date.now().toString(),
      sender: "bot",
      text: "Hello 👋 I am your AI Desk Helper. How can I help you today?",
    };

    setMessages((prev) => [botReply, ...prev]);
  }, 1500);
  };
  const handleVoicePress = () => {};
  return (
    <SafeAreaView style={[styles.container]}>
      {/* Header View */}
      <View style={styles.headerViewContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: "absolute",
            left: 0,
          }}
        >
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

        <Text style={styles.headerTitle}>AI Desk Helper</Text>
      </View>

      {/* Chat View */}
      <FlatList  data={messages}
          renderItem={renderChatBoxItem}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={{
            gap: 20,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
    isBotTyping ? <TypingBubble /> : null
  }
      />

      {/* Input */}
      <View
        style={{
          paddingTop: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Controller
          control={control}
          name="message"
          rules={{
            required: "Message is required",
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <GlassmorphismInput
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              placeholder={"Enter your message here ......"}
              iconName={
                messageValue.length > 0 ? "send-outline" : "mic-outline"
              }
              isTouchable={true}
              onTouchableIconPress={
                messageValue.length > 0 ? handleSubmit(onSubmit) : handleVoicePress
              }
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default chat;

const renderChatBoxItem = ({ item }) => {
  return (
    <MessageBox
      isUser={item.sender == "user" ? true : false}
      image={
        item.sender == "user"
          ? require("../assets/images/profile-img.png")
          : require("../assets/icons/message-bot.png")
      }
      question={item.sender === "user" ? item.text : undefined}
      answer={item.sender === "bot" ? item.text : undefined}
      isTyping = {item.sender == "bot" ? true:false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#0C1013",
    color: "#fff",
  },

  headerViewContainer: {
    position: "relative",

    paddingBottom: 20,
  },

  headerTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 24,
  },
});

{
  /*<KeyboardAvoidingView contentContainerStyle={{
          gap:20,
          paddingBottom: 30
        }}>
          <MessageBox isUser={true} image={require("../assets/images/profile-img.png")} 
          question={"Hi..."}
          />
          <MessageBox isUser={false} image={require("../assets/icons/message-bot.png")}
          answer={"Hello 👋"}
          />
          <MessageBox isUser={true} image={require("../assets/images/profile-img.png")} 
          question={"Hi..."}
          />
          <MessageBox isUser={false} image={require("../assets/icons/message-bot.png")}
          answer={"Hello 👋"}
          />
          <MessageBox isUser={true} image={require("../assets/images/profile-img.png")} 
          question={"What is the attendance policy?"}
          />
          <MessageBox isUser={false} image={require("../assets/icons/message-bot.png")}
          answer={"✅ According to IT Department rules, students must maintain at least 75% attendance in each subject to be eligible for exams. Would you like details about attendance shortage fines or condonation rules?"}
          />
          <MessageBox isUser={true} image={require("../assets/images/profile-img.png")} 
          question={"Hi..."}
          />
          <MessageBox isUser={false} image={require("../assets/icons/message-bot.png")}
          answer={"Hello 👋"}
          />
          
        </KeyboardAvoidingView> */
}
