import { View, Text, StyleSheet, TextInput } from 'react-native'
import {BlurView} from "expo-blur"
import {LinearGradient} from "expo-linear-gradient"
import { useRef } from 'react'
import { Controller } from 'react-hook-form'
const GlassmorphismOtpInput = ({ control }) => {
  const inputsRef = [useRef(), useRef(), useRef(), useRef()];

  return (
    <Controller
      control={control}
      name="otp"
      rules={{
        required: "OTP is required",
        validate: (value) =>
          value.every((num) => num !== "") || "All fields required",
      }}
      render={({ field: { onChange, value } }) => (
        <View style={{ maxWidth: 376, flexDirection: "row", justifyContent: "center" , gap:20 }}>
          {value.map((digit, index) => (
            <View key={index} style={styles.container}>
              <BlurView intensity={15} style={styles.glass}>
                <LinearGradient
                  colors={[
                    "rgba(255,255,255,0.1)",
                    "rgba(255,255,255,0.02)",
                  ]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradient}
                >
                  <TextInput
                    ref={inputsRef[index]}
                    value={digit}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={styles.input}
                    onChangeText={(text) => {
                      const newText = text.replace(/[^0-9]/g, "");
                      const newOtp = [...value];
                      newOtp[index] = newText;
                      onChange(newOtp);

                      if (newText && index < 3) {
                        inputsRef[index + 1].current.focus();
                      }
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (
                        nativeEvent.key === "Backspace" &&
                        index > 0 &&
                        !value[index]
                      ) {
                        inputsRef[index - 1].current.focus();
                      }
                    }}
                  />
                </LinearGradient>
              </BlurView>
            </View>
          ))}
        </View>
      )}
    />
  );
};

export default GlassmorphismOtpInput

const styles = StyleSheet.create({
    container : {
        width:64,
        borderRadius:20,
        height:74,
        backgroundColor: 'rgba(247, 254, 255, 0.1)',
        overflow:"hidden",
    }
    ,
  gradient: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",

  },

  input: {
    fontFamily:"Roboto",
    fontSize:40,
    fontWeight:"medium",
    color:"#fff",
    textAlign:"center"
  },
})