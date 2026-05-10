import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import VoiceRobot from "../../components/Chat/VoiceRobot";
import GlassmorphismCard from "../../components/GlassmorphismCard/GlassmorphismCard";
import { Audio } from "expo-av";
import Voice from "@react-native-voice/voice";
import { useProcessVoiceMutation } from "../../store/services/voiceApi";
import { BASE_URL, BASE_URL_8000 } from "../../utils/constants";

import { getItem, setItem } from "../../utils/asyncStorage";

const VoiceScreen = () => {
  const [status, setStatus] = useState("idle");
  const recordingRef = useRef(null);
  const soundRef = useRef(null);
  const [activeChatId, setActiveChatId] = useState(null);
  // RTK Query Mutation Hook
  const [processVoice, { isLoading }] = useProcessVoiceMutation();

  useEffect(() => {
    return () => {
      const cleanup = async () => {
        try {
          if (recordingRef.current) {
            await recordingRef.current.stopAndUnloadAsync();
            recordingRef.current = null;
          }

          if (soundRef.current) {
            await soundRef.current.unloadAsync();
            soundRef.current = null;
          }
        } catch (e) {}
      };

      cleanup();
    };
  }, []);

  useEffect(() => {
  return () => {
    try {
      // 🔥 THIS IS REQUIRED FOR TAB SWITCH FIX
      Voice.destroy().then(Voice.removeAllListeners);
    } catch (e) {}
  };
}, []);

  //   useEffect(() => {
  //   return () => {
  //     if (soundRef.current) {
  //       soundRef.current.unloadAsync();
  //     }
  //   };
  // }, []);
  // useEffect(() => {
  //   if (isLoading) {
  //     setStatus('speaking');
  //   } else if (!recordingRef.current && status !== 'idle') {
  //     setStatus('idle');
  //   }
  // }, [isLoading]);
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
  const isDisabled = status === "processing" || status === "speaking";
  const playAudio = async (url) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true },
      );

      soundRef.current = sound;

      return new Promise((resolve) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            sound.setOnPlaybackStatusUpdate(null);
            sound.unloadAsync(); // 🔥 ADD THIS
            resolve();
          }
        });
      });
    } catch (error) {
      console.log("Audio play error:", error);
    }
  };
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status !== "granted") return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      recordingRef.current = recording;

      setStatus("listening");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      setStatus("processing");

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
      });
      const formData = new FormData();
      formData.append("audio", {
        uri,
        name: "voice.m4a",
        type: "audio/m4a",
      });

      formData.append("chatId", activeChatId || "");

      const result = await processVoice(formData).unwrap();

      const audioPath = result.data.aiData.audio_url;
      const audioUrl = `${BASE_URL_8000}${audioPath}`;

      const newId = result.data.chatId;

      const idToUse = newId || activeChatId;

      setActiveChatId(idToUse);
      await setItem("active_chat_id", idToUse);

      // 🔥 KEEP speaking UNTIL AUDIO ENDS
      setStatus("speaking");

      await playAudio(audioUrl);

      // ONLY HERE go idle
      setStatus("idle");
    } catch (error) {
      console.error("Voice Processing Error:", error);
      setStatus("idle");
    }
  };
  const toggleMic = () => {
    if (status === "idle") {
      startRecording();
    } else if (status === "listening") {
      stopRecording();
    }
  };

  return (
     <View style={{ flex: 1, backgroundColor: "#0C1013" }}>
    <ImageBackground
      source={require("../../assets/images/on-boarding-bg-1.png")}
              style={styles.background}
              imageStyle={{ opacity: 0.4 }}
              blurRadius={Platform.OS === "ios" ? 60 : 30}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Voice Assistant</Text>

          {/* <TouchableOpacity style={styles.editButton}>
            <Ionicons name="mic-outline" size={18} color="white" />
          </TouchableOpacity> */}
        </View>
        <View style={styles.robotContainer}>
          {/* status 'speaking' tab bhi hoga jab backend process kar raha ho */}
          <VoiceRobot status={status} />
          <Text
            style={[
              styles.statusText,
              {
                color:
                  status === "listening"
                    ? "#00ffcc"
                    : status === "processing"
                      ? "#ffcc00"
                      : status === "speaking"
                        ? "#ff00ff"
                        : "#fff",
              },
            ]}
          >
            {status === "listening" && "I'm Listening..."}
            {status === "processing" && "AI is Thinking..."}
            {status === "speaking" && "AI is Speaking..."}
            {status === "idle" && "Tap to Start"}
          </Text>
        </View>

        <View style={styles.controlsContainer}>
          {/* Button disable karein agar processing ho rahi ho */}
          <TouchableOpacity
            onPress={toggleMic}
            disabled={isDisabled}
            activeOpacity={0.8}
          >
            <GlassmorphismCard
              style={styles.micButton}
              gradientStyle={styles.micGradient}
            >
              {isLoading ? (
                <Ionicons
                  name="ellipsis-horizontal"
                  size={40}
                  color="#ff00ff"
                />
              ) : (
                <Ionicons
                  name={status === "listening" ? "stop" : "mic-outline"}
                  size={40}
                  color={status === "listening" ? "#00ffcc" : "#fff"}
                />
              )}
            </GlassmorphismCard>
          </TouchableOpacity>

          <Text style={styles.hintText}>
            {status === "idle"
              ? "Speak to your assistant"
              : "Tap to stop & analyze"}
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  background: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    // textAlign:"center"
  },

  editButton: {
    backgroundColor: "#1C2D47",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  robotContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  statusText: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 0,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  controlsContainer: { alignItems: "center", marginBottom: 0 },
  micButton: {
    height: 90,
    width: 90,
    
    borderRadius: 45,
    borderBottomLeftRadius: 45,
  },
  micGradient: {
    height: 90,
    width: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: { color: "rgba(255,255,255,0.4)", marginVertical: 20, fontSize: 14 },
});

export default VoiceScreen;
