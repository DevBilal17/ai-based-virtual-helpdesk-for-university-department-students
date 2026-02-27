import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";
const TabLayout = () => {
  return (
    <Tabs
      screenOptions={({route})=>({
        headerShown:false,
        tabBarIcon:({color,focused})=>{
            let iconName;
            let size = 30;
            if(route.name == "index"){
                iconName == "home"
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
          marginHorizontal:20
        },

        
        tabBarItemStyle: {

         marginTop:7
        },
        tabBarShowLabel: false,
        
      })}
    />
  )
}

export default TabLayout