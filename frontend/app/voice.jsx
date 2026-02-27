import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const voice = () => {
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
   </SafeAreaView>
  )
}

export default voice


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