//HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>학습 모드를 선택하세요</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VideoPracticeScreen')}
      >
        <Text style={styles.buttonText}>🎬 동영상 학습</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('GameScreen', {
          sentences: [
            { text: "I don't remember my mother's face very well." },
            { text: "She used to sing me to sleep every night." },
            { text: "He always brings his lunch from home." }
          ],
          currentIndex: 0,
        })}
      >
        <Text style={styles.buttonText}>🎮 Game 학습</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 30 },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default HomeScreen;
