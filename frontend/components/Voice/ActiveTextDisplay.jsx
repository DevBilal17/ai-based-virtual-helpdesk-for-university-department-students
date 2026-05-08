import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ActiveTextDisplay = ({ fullText, isSpeaking }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const words = fullText.split(' ');

  useEffect(() => {
    let interval;
    if (isSpeaking) {
      // Demo ke liye hum manual timer laga rahe hain
      // Real app mein aap speech engine ki speed ke hisab se index update karenge
      setCurrentWordIndex(0);
      interval = setInterval(() => {
        setCurrentWordIndex((prev) => (prev < words.length - 1 ? prev + 1 : prev));
      }, 350); // Har 350ms baad agla word highlight hoga
    } else {
      setCurrentWordIndex(-1);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isSpeaking, fullText]);

  return (
    <View style={styles.textContainer}>
      <View style={styles.wordsWrapper}>
        {words.map((word, index) => (
          <Text
            key={index}
            style={[
              styles.wordBase,
              index === currentWordIndex ? styles.activeWord : styles.dimmedWord
            ]}
          >
            {word}{' '}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordBase: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 2,
  },
  activeWord: {
    color: '#ff00ff', // Pink glow for current word
    textShadowColor: 'rgba(255, 0, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    transform: [{ scale: 1.1 }], // Thoda bada dikhega
  },
  dimmedWord: {
    color: 'rgba(255, 255, 255, 0.3)', // Baaki words dim rahenge
  },
});

export default ActiveTextDisplay;