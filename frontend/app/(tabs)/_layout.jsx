import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";
const TabLayout = () => {
  return (
    <Tabs
    initialRouteName='chat'
      screenOptions={({route})=>({
        
        headerShown:false,
        tabBarIcon:({color,focused})=>{
            let iconName;
            let size = 28;
            if(route.name == "index"){
                iconName = !focused ? "home-outline" : "home"
            }
            else if(route.name == "chat"){
                iconName = !focused ? `chatbubble-outline` : 'chatbubble'
            }
            else if(route.name == "location"){
                iconName = !focused ? "location-outline" : 'location'
            }
            else if(route.name == "profile"){
                iconName = !focused ? "person-outline" : 'person'
            }

            return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#C0C0C0",
      
        tabBarStyle: {
          position: "absolute", 
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: "#1c1d1e",
          height: 60,
          borderRadius: 30,
          borderTopWidth: 0,
          elevation: 5, 
          marginHorizontal:15
        },

        
        tabBarItemStyle: {

         marginTop:9
        },
        tabBarShowLabel: false,
        
      })}
    />
  )
}

export default TabLayout