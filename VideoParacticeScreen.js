//VideoParacticeScreen.js
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as Speech from 'expo-speech';

const sampleScript = [
  "I don't remember my mother's face very well.",
  "She died when I was very young.",
  "My father rarely spoke about her."
];

const VideoPracticeScreen = () => {
  const [playingSentenceIndex, setPlayingSentenceIndex] = useState(-1);

  const handleSpeak = (text, index) => {
    setPlayingSentenceIndex(index);
    Speech.speak(text, {
      onDone: () => setPlayingSentenceIndex(-1)
    });
  };

  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={220}
        play={false}
        videoId={'YOUR_VIDEO_ID'} // YouTube 영상 ID
      />

      <ScrollView style={styles.scriptContainer}>
        {sampleScript.map((sentence, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSpeak(sentence, index)}
          >
            <Text style={[
              styles.sentence,
              index === playingSentenceIndex && styles.highlight
            ]}>
              {sentence}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scriptContainer: {
    flex: 1,
    padding: 20,
  },
  sentence: {
    fontSize: 18,
    marginBottom: 12,
    color: '#000',
  },
  highlight: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default VideoPracticeScreen;
