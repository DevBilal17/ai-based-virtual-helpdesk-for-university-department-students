
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect ,useCallback} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassmorphismCard from "../../../components/GlassmorphismCard/GlassmorphismCard";
import { Ionicons } from "@expo/vector-icons";
import MessageBox from "../../../components/Chat/MessageBox";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import GlassmorphismInput from "../../../components/Forms/GlassmorphismInput";
import TypingBubble from "../../../components/Chat/TypingBubble";
import AIVisualizer from "../../../components/Chat/AIVisualizer";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import { useAskQuestionMutation } from "../../../store/services/chatApi";
import { getItem, setItem, removeItem } from "../../../utils/asyncStorage"; 
import { useGetChatByIdQuery } from "../../../store/services/chatApi";
import { useLocalSearchParams } from "expo-router";
import Voice from '@react-native-voice/voice';
const chat = () => {
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: { message: "" },
  });
  const { chatId } = useLocalSearchParams();
  const navigation = useNavigation();
const [isListening, setIsListening] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const messageValue = watch("message") || "";
  console.log(messages)
const {
  data: selectedChatData,
  isLoading: isChatLoading,
  refetch
} = useGetChatByIdQuery(activeChatId);
console.log("Selected Chat Data",selectedChatData)
useEffect(() => {
  if (chatId) {
    setActiveChatId(chatId);
  }
}, [chatId]);
console.log(activeChatId)
useFocusEffect(
  useCallback(() => {
    const loadChat = async () => {
      const savedId = await getItem("active_chat_id");
      if (savedId) setActiveChatId(savedId);
    };

    loadChat();
  }, [])
);
useEffect(() => {
  if (selectedChatData?.data?.chat?.messages) {
   const formattedMessages = selectedChatData?.data?.chat?.messages?.map((msg) => ({
    id: msg._id,
    sender: msg.sender,
    text: msg.text,
    metadata: msg.metadata,
    timestamp: msg.timestamp,
    isHistory: true, 
  })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) || [];

    setMessages(formattedMessages);
    setIsHydrated(true);
  }
}, [selectedChatData]);
useEffect(() => {
  if (activeChatId) {
    refetch();
  }
}, [activeChatId]);
// --- Voice Logic Setup ---
  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechError = (e) => {
      console.error("Speech Error:", e);
      setIsListening(false);
    };
    
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        const spokenText = e.value[0];
        // 1. Fill the input field visually
        setValue("message", spokenText);
        // 2. Automatically trigger the submission
        handleSubmit(onSubmit)();
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
    useEffect(() => {
    const syncSession = async () => {
      const savedId = await getItem("active_chat_id");
      if (savedId) {
        setActiveChatId(savedId);
        console.log("Existing Session Found:", savedId);
        
      }
    };
    syncSession();
  }, []);


  const [askQuestion, { isLoading: isBotTyping }] = useAskQuestionMutation();
const toggleListening = async () => {
    try {
      if (isListening) {
        await Voice.stop();
      } else {
        reset({ message: "" }); // Clear input before listening
        await Voice.start('en-US'); 
      }
    } catch (e) {
      console.error("Voice Toggle Error:", e);
    }
  };
  

  const onSubmit = async (data) => {
    const userInput = data?.message.trim();
    if (userInput === "" || isBotTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userInput,
    };
    setMessages((prev) => [userMessage, ...prev]);
    reset();

    try {
      const response = await askQuestion({
        query: userInput,
        chatId: activeChatId, 
      }).unwrap();

      const newId = response.data.chatId;
      if (newId && newId !== activeChatId) {
        setActiveChatId(newId);
        await setItem("active_chat_id", newId);
      }

      const botReply = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: response.data.botResponse.text,
        metadata: response.data.botResponse.metadata, 
      };

      setMessages((prev) => [botReply, ...prev]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Sorry, I encountered an error connecting to the AI service.",
      };
      setMessages((prev) => [errorMessage, ...prev]);
    }
  };


  const startNewChat = async () => {
    await removeItem("active_chat_id");
    setActiveChatId(null);
    setMessages([]);
  };

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.openDrawer()}>
  <GlassmorphismCard
    style={styles.iconCard}
    gradientStyle={styles.iconGradient}
  >
    <Ionicons name="menu" size={20} color="white" />
  </GlassmorphismCard>
</TouchableOpacity>

  <Text style={styles.headerTitle}>AI Desk Helper</Text>

  <TouchableOpacity onPress={startNewChat}>
    <GlassmorphismCard
      style={styles.iconCard}
      gradientStyle={styles.iconGradient}
    >
      <Ionicons name="add" size={18} color="white" />
    </GlassmorphismCard>
  </TouchableOpacity>
</View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        style={{ flex: 1 }}
      >
       {/* --- 3D MODEL LOGIC --- */}
        {messages.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.threeDStage}>
              <AIVisualizer isTyping={isBotTyping} />
            </View>
            <Text style={styles.welcomeText}>How can I help you today?</Text>
          </View>
        ) : (
          /* --- CHAT LIST --- */
          <FlatList
            data={messages}
            renderItem={renderChatBoxItem}
            keyExtractor={(item) => item.id}
            inverted
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={isBotTyping ? <TypingBubble /> : null}
          />
        )}

        <View style={styles.inputWrapper}>
          <Controller
            control={control}
            name="message"
            render={({ field: { onBlur, onChange, value } }) => (
              <GlassmorphismInput
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                placeholder={isListening ? "Listening..." : "Ask me anything..."}
                iconName={isListening ? "stop-circle" : (messageValue.length > 0 ? "send" : "mic")}
                iconColor={isListening ? "#EF4444" : "#635BFF"}
                isTouchable={true}
                onTouchableIconPress={
                  messageValue.length > 0 
                    ? handleSubmit(onSubmit) 
                    : toggleListening
                }
              />
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const renderChatBoxItem = ({ item }) => {
  const shouldAnimate = !item.isHistory && item.sender === "bot";
  return (
  <MessageBox
    isUser={item.sender === "user"}
    image={
      item.sender === "user"
        ? require("../../../assets/images/profile-img.png")
        : require("../../../assets/icons/message-bot.png")
    }
    question={item.sender === "user" ? item.text : undefined}
    answer={item.sender === "bot" ? item.text : undefined}
    // Agar MessageBox metadata support karta hai to:
    metadata={item.metadata}
    shouldAnimate={shouldAnimate}
  />
)};

const styles = StyleSheet.create({
  header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginVertical: 20,
},

headerTitle: {
  color: "white",
  fontSize: 20,
  fontWeight: "700",
},

iconCard: {
  borderRadius: 14,
  height: 44,
  width: 44,
},

iconGradient: {
  height: 44,
  width: 44,
  alignItems: "center",
  justifyContent: "center",
},
  container: { flex: 1, backgroundColor: "#0C1013", paddingHorizontal: 14,},
  headerViewContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 15 },
  backButton: { position: "absolute", left: 0 },
  backCard: { borderRadius: 15, height: 40, width: 40 },
  backGradient: { height: 40, width: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "600", letterSpacing: 0.5 },
  
  // --- New Empty State Styles ---
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  threeDStage: {
    height: 250, // Slightly bigger since it's centered alone
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 18,
    marginTop: 20,
    fontWeight: "500",
    textAlign: "center"
  },
  glowBall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00ffcc",
    opacity: 0.2,
    shadowColor: "#00ffcc",
    shadowRadius: 20,
    shadowOpacity: 0.8,
    elevation: 20,
  },
  glowBallActive: {
    backgroundColor: "#ff00ff", // Changes color when bot is "thinking"
    transform: [{ scale: 1.2 }],
  },
  stageText: { color: "#555", marginTop: 10, fontSize: 12, textTransform: "uppercase" },

  listContent: { gap: 15, paddingBottom: 20, paddingTop: 10 },
  inputWrapper: { paddingVertical: 15, backgroundColor: "#0C1013" ,},
});

export default chat;