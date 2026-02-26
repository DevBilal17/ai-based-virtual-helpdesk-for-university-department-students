import { View, Text, ImageBackground, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Dimensions } from 'react-native';
const {width , height } = Dimensions.get("window");
const Slide = ({bg,title,subtitle,img}) => {
  return (
   <ImageBackground
      source={bg}
      resizeMode="cover"
      style={styles.container}
    >
     
      <Image source={img} style={styles.img}/>
      {/* Content */}
      <View style={{ paddingHorizontal: 32 }}>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
    </ImageBackground>
  )
}

export default Slide


const styles = StyleSheet.create({
    container : {
        width : width,
        height : height,
        display:"flex",
        justifyContent:"center",
        gap: 24,
    },
    img : {
        width: width * 0.9,
        height: width,
        alignSelf:"center",
    },
    title : {
        fontWeight:600,
        fontSize:32,
        color:"#fff",
        textAlign:"center",
    },
    subtitle : {
        fontSize:20,
        color:"#fff",
        textAlign:"center",
        marginTop:12,
    }
})