import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { removeItem } from '../utils/asyncStorage'
import { useNavigation, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const login = () => {
  const navigation = useNavigation();
  const handleReset = async() => {
    await removeItem("onboardingCompleted");
    navigation.navigate("onboarding");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity onPress={handleReset}>
        <Text>Reset</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default login