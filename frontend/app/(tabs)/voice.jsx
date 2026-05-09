import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import VoiceRobot from '../../components/Chat/VoiceRobot';
import GlassmorphismCard from '../../components/GlassmorphismCard/GlassmorphismCard';
import { Audio } from 'expo-av';
import { useProcessVoiceMutation } from '../../store/services/voiceApi'; 
import { BASE_URL, BASE_URL_8000 } from '../../utils/constants';

import { getItem, setItem } from '../../utils/asyncStorage';

const VoiceScreen = () => {
  const [status, setStatus] = useState('idle');
  const recordingRef = useRef(null);
  const soundRef = useRef(null);
    const [activeChatId, setActiveChatId] = useState(null);
  // RTK Query Mutation Hook
  const [processVoice, { isLoading }] = useProcessVoiceMutation();

useEffect(() => {
  return () => {
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync().catch(() => {});
    }
  };
}, []);

  useEffect(() => {
  return () => {
    if (soundRef.current) {
      soundRef.current.unloadAsync();
    }
  };
}, []);
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
const isDisabled = status === 'processing' || status === 'speaking';
const playAudio = async (url) => {
  try {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );

    soundRef.current = sound;

    return new Promise((resolve) => {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
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

    if (permission.status !== 'granted') return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    recordingRef.current = recording;

    setStatus('listening');

  } catch (err) {
    console.error('Failed to start recording', err);
  }
};

const stopRecording = async () => {
  try {
    if (!recordingRef.current) return;

    setStatus('processing');

    await recordingRef.current.stopAndUnloadAsync();
    const uri = recordingRef.current.getURI();
    recordingRef.current = null;

    const formData = new FormData();
    formData.append('audio', {
      uri,
      name: 'voice.m4a',
      type: 'audio/m4a',
    });

    formData.append('chatId', activeChatId || '');

    const result = await processVoice(formData).unwrap();

    const audioPath = result.data.aiData.audio_url;
    const audioUrl = `${BASE_URL_8000}${audioPath}`;

    const newId = result.data.chatId;
    if (newId && newId !== activeChatId) {
      setActiveChatId(newId);
      await setItem("active_chat_id", newId);
    }

    // 🔥 KEEP speaking UNTIL AUDIO ENDS
    setStatus('speaking');

    await playAudio(audioUrl);

    // ONLY HERE go idle
    setStatus('idle');

  } catch (error) {
    console.error("Voice Processing Error:", error);
    setStatus('idle');
  }
};
  const toggleMic = () => {
    if (status === 'idle') {
      startRecording();
    } else if (status === 'listening') {
      stopRecording();
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/on-boarding-bg-1.png")} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        
       <View style={styles.header}>
  <Text style={styles.headerTitle}>Voice Assistant</Text>

  <TouchableOpacity style={styles.editButton}>
    <Ionicons name="mic-outline" size={18} color="white" />
  </TouchableOpacity>
</View>
        <View style={styles.robotContainer}>
          {/* status 'speaking' tab bhi hoga jab backend process kar raha ho */}
          <VoiceRobot status={status} />
         <Text
  style={[
    styles.statusText,
    {
      color:
        status === 'listening'
          ? '#00ffcc'
          : status === 'processing'
          ? '#ffcc00'
          : status === 'speaking'
          ? '#ff00ff'
          : '#fff',
    },
  ]}
>
  {status === 'listening' && "I'm Listening..."}
  {status === 'processing' && "AI is Thinking..."}
  {status === 'speaking' && "AI is Speaking..."}
  {status === 'idle' && "Tap to Start"}
</Text>
        </View>

        <View style={styles.controlsContainer}>
          {/* Button disable karein agar processing ho rahi ho */}
          <TouchableOpacity onPress={toggleMic} disabled={isDisabled} activeOpacity={0.8}>
            <GlassmorphismCard style={styles.micButton} gradientStyle={styles.micGradient}>
              {isLoading ? (
                <Ionicons name="ellipsis-horizontal" size={40} color="#ff00ff" />
              ) : (
                <Ionicons 
                  name={status === 'listening' ? "stop" : "mic-outline"} 
                  size={40} 
                  color={status === 'listening' ? "#00ffcc" : "#fff"} 
                />
              )}
            </GlassmorphismCard>
          </TouchableOpacity>
          
          <Text style={styles.hintText}>
            {status === 'idle' ? "Speak to your assistant" : "Tap to stop & analyze"}
          </Text>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginVertical: 20,
},

headerTitle: {
  color: 'white',
  fontSize: 24,
  fontWeight: '700',
},

editButton: {
  backgroundColor: '#1C2D47',
  padding: 10,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.1)',
},
  robotContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { fontSize: 22, fontWeight: '700', marginTop: 20, textTransform: 'uppercase', letterSpacing: 1 },
  controlsContainer: { alignItems: 'center', marginBottom: 0 },
  micButton: { height: 90, width: 90, borderRadius: 45, borderBottomLeftRadius: 45 },
  micGradient: { height: 90, width: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
  hintText: { color: 'rgba(255,255,255,0.4)', marginTop: 15, fontSize: 14 }
});

export default VoiceScreen;