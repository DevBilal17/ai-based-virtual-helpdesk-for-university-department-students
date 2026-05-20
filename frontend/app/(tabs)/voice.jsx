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
import {
  AudioModule,
  RecordingPresets,
  AudioRecorder,
  createAudioPlayer,
} from "expo-audio";
import { Audio } from "expo-av";
import Voice from "@react-native-voice/voice";
import {
  useProcessTextMutation,
  useProcessVoiceMutation,
} from "../../store/services/voiceApi";
import { BASE_URL, BASE_URL_8000 } from "../../utils/constants";
import { router, useFocusEffect } from "expo-router";
import { getItem, setItem } from "../../utils/asyncStorage";

const VoiceScreen = () => {
  const [status, setStatus] = useState("idle");
  const recorderRef = useRef(null);
  const soundRef = useRef(null);
  const [locationPrompt, setLocationPrompt] = useState(null);
  const [needsInternet, setNeedsInternet] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState(null);
  const sessionRef = useRef(0);
  const stopRef = useRef(false);
  
  // RTK Query Mutation Hook
  const [processVoice, { isLoading }] = useProcessVoiceMutation();
  const [processText] = useProcessTextMutation();
  const handleLocationNavigate = () => {
    if (!locationPrompt) return;

    const { nodeId, intent } = locationPrompt;

    setLocationPrompt(null);

    router.push({
      pathname: "(tabs)/location",
      params: {
        nodeId,
        intent,
      },
    });
  };
  const handleBotResponse = (aiData) => {
    const nodeId =
      aiData.intent === "visit"
        ? aiData.officeNodeId || aiData.doorNodeId
        : aiData.doorNodeId;

    if (nodeId) {
      setLocationPrompt({
        nodeId,
        intent: aiData.intent,
      });
    }

    setNeedsInternet(aiData.needs_internet || false);

    setLastQuery(aiData.transcription || "");
  };
  useEffect(() => {
    return () => {
      const cleanup = async () => {
        try {
          if (recorderRef.current) {
            try {
              await recorderRef.current.stop();
            } catch (e) {}

            recorderRef.current = null;
          }

          if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current = null;
          }
        } catch (e) {
          console.log(e);
        }
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
  useEffect(() => {
  return () => {
    stopRef.current = true;

    if (soundRef.current) {
      soundRef.current.stopAsync().catch(() => {});
      soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }
  };
}, []);
useFocusEffect(
  React.useCallback(() => {
    return () => {
      stopPlayback();
    };
  }, [])
);
  const isDisabled = status === "processing";
  const isRecording = status === "listening";
const isSpeaking = status === "speaking";
const isProcessing = status === "processing";
const playAudio = async (url, sessionId) => {
  try {
    stopRef.current = false;

    if (soundRef.current) {
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );

    soundRef.current = sound;

    return new Promise((resolve) => {
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (!status.isLoaded) return;

        // STOP pressed OR new session started
        if (stopRef.current || sessionId !== sessionRef.current) {
          await sound.stopAsync().catch(() => {});
          resolve();
          return;
        }

        if (status.didJustFinish) {
          resolve();
        }
      });
    }).finally(async () => {
      try {
        await sound.unloadAsync();
      } catch {}
      soundRef.current = null;
    });

  } catch (error) {
    console.log(error);
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

      recorderRef.current = recording;

      setStatus("listening");
    } catch (err) {
      console.error("Recording failed", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recorderRef.current) return;

      setStatus("processing");

      await recorderRef.current.stopAndUnloadAsync();

      const uri = recorderRef.current.getURI();

      recorderRef.current = null;

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

      const aiData = result.data.aiData;

      handleBotResponse(aiData);

      const audioPath = aiData.audio_url;
      const audioUrl = `${BASE_URL_8000}${audioPath}`;

      const newId = result.data.chatId;

      const idToUse = newId || activeChatId;

      setActiveChatId(idToUse);

      await setItem("active_chat_id", idToUse);

  setStatus("speaking");
sessionRef.current += 1;
const currentSession = sessionRef.current;

await playAudio(audioUrl, currentSession);

      setStatus("idle");
    } catch (error) {
      console.error("Voice Processing Error:", error);

      setStatus("idle");
    }
  };
const stopPlayback = async () => {
  try {
    stopRef.current = true;
    console.log("Stop Playback Triggered, Session ID:", sessionRef.current);
    sessionRef.current += 1; //  cancel old session

    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }

    setStatus("idle");
  } catch (e) {
    setStatus("idle");
  }
};
useEffect(() => {
  if (status === "listening") {
    setNeedsInternet(false);
    setLocationPrompt(null);
  }
}, [status]);
  const handleInternetSearch = async () => {
    try {
      setStatus("processing"); // 🔥 show loading immediately

      const result = await processText({
        query: lastQuery,
        use_internet: true,
        chatId: activeChatId || "",
      }).unwrap();

      const aiData = result.data.aiData;

      handleBotResponse(aiData);

      const audioUrl = `${BASE_URL_8000}${aiData.audio_url}`;

      setStatus("speaking");

      await playAudio(audioUrl);

      setStatus("idle");

      setNeedsInternet(false);
    } catch (error) {
      console.log("Internet Search Error", error);
      setStatus("idle");
    }
  };
const toggleMic = () => {
  if (status === "speaking") {
    stopPlayback();
    return;
  }

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
       {locationPrompt && !isRecording && !isSpeaking && (
  <TouchableOpacity
    style={styles.locationButton}
    onPress={handleLocationNavigate}
  >
    <Ionicons name="location-outline" size={20} color="#fff" />
    <Text style={styles.locationButtonText}>Go To Location</Text>
  </TouchableOpacity>
)}

      {needsInternet && !isRecording && !isSpeaking && (
  <TouchableOpacity
    style={styles.internetButton}
    onPress={handleInternetSearch}
  >
    <Ionicons name="globe-outline" size={20} color="#fff" />
    <Text style={styles.internetButtonText}>Use Internet</Text>
  </TouchableOpacity>
)}
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
               {status === "speaking" ? (
  <Ionicons name="stop-circle-outline" size={40} color="#ff4444" />
) : status === "processing" ? (
  <Ionicons name="ellipsis-horizontal" size={40} color="#ff00ff" />
) : status === "listening" ? (
  <Ionicons name="stop" size={40} color="#00ffcc" />
) : (
  <Ionicons name="mic-outline" size={40} color="#fff" />
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
  hintText: {
    color: "rgba(255,255,255,0.4)",
    marginVertical: 20,
    fontSize: 14,
  },
  internetButton: {
    position: "absolute",
    bottom: 180,
    right: 20,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#2563eb",

    paddingVertical: 12,
    paddingHorizontal: 18,

    borderRadius: 50,

    elevation: 10,
    zIndex: 999,
  },

  internetButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "700",
  },

  locationButton: {
    position: "absolute",
    bottom: 120,
    right: 20,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#10b981",

    paddingVertical: 12,
    paddingHorizontal: 18,

    borderRadius: 50,

    elevation: 10,
    zIndex: 999,
  },

  locationButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "700",
  },
});

export default VoiceScreen;
