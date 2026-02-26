import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
const { width, height } = Dimensions.get("window");
const Slide = ({ bg, title, subtitle, img, active }) => {
  return (
    <ImageBackground source={bg} resizeMode="cover" style={styles.container}>
      
      {active && (
        <>
          <Animated.Image
            entering={FadeInUp.duration(400)}
            source={img}
            style={styles.img}
          />

          <View style={{ paddingHorizontal: 32 }}>
            <Animated.Text
              entering={FadeInDown.delay(200).duration(400)}
              style={styles.title}
            >
              {title}
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.delay(400).duration(400)}
              style={styles.subtitle}
            >
              {subtitle}
            </Animated.Text>
          </View>
        </>
      )}

    </ImageBackground>
  );
};

export default Slide;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    display: "flex",
    justifyContent: "center",
    gap: 24,
  },
  img: {
    width: width * 0.9,
    height: width,
    alignSelf: "center",
  },
  title: {
    fontWeight: 600,
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
  },
});
