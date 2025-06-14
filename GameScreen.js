//GameScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import * as Speech from 'expo-speech';

const QWERTY_KEYS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
];

const GameScreen = ({ route, navigation }) => {
  if (!route.params) {
    return (
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>학습 모드를 선택하세요</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('VideoPracticeScreen')}
        >
          <Text style={styles.menuButtonText}>🎬 동영상 학습</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('GameScreen', {
            sentences: [
              { text: "I don't remember my mother's face very well." },
              { text: "She used to sing me to sleep every night." },
              { text: "He always brings his lunch from home." }
            ],
            currentIndex: 0,
          })}
        >
          <Text style={styles.menuButtonText}>🎮 Game 학습</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { sentences, currentIndex } = route.params;
  const sentence = sentences[currentIndex];
  const [userWords, setUserWords] = useState([]);
  const [result, setResult] = useState('');
  const [chunks, setChunks] = useState([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(-1);

  const words = sentence.text.split(/\s+/);
  const wordMap = {}; // { D: 'Do', Y: 'You' ... }

  words.forEach(word => {
    const first = word[0].toUpperCase();
    if (!wordMap[first]) {
      wordMap[first] = word;
    }
  });

  const validKeys = Object.keys(wordMap); // ['D', 'Y', 'W', 'S', 'M']

  const handleSpeak = () => {
    Speech.speak(sentence.text);
  };

  const handleSpeakChunks = async () => {
    const chunkList = chunkSentence(sentence.text);
    setChunks(chunkList);
    for (let i = 0; i < chunkList.length; i++) {
      setCurrentChunkIndex(i);
      Speech.speak(chunkList[i]);
      await new Promise(resolve => setTimeout(resolve, 1800));
    }
    setCurrentChunkIndex(-1);
  };

  const chunkSentence = (text) => {
    const chunks = [];
    const chunkSize = 3; // 기본적으로 3단어씩 나누기
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
  };

  const handlePressKey = (char) => {
    const word = wordMap[char];
    if (word && !userWords.includes(word)) {
      setUserWords(prev => [...prev, word]);
    }
  };

  const handleCheck = () => {
    const inputString = userWords.join(' ').toLowerCase();
    const targetString = sentence.text.toLowerCase();
    if (inputString === targetString) {
      setResult('✅ 정답입니다!');
    } else {
      setResult('❌ 틀렸습니다.');
    }
  };

  const handleReset = () => {
    setUserWords([]);
    setResult('');
    setChunks([]);
    setCurrentChunkIndex(-1);
  };

  const handleNext = () => {
    if (currentIndex + 1 < sentences.length) {
      navigation.replace('GameScreen', {
        sentences,
        currentIndex: currentIndex + 1,
      });
    } else {
      Alert.alert('끝', '마지막 문장입니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎧 문장을 듣고 키보드로 단어 입력</Text>
      <Text style={styles.sentenceHint}>힌트 문장: {sentence.text}</Text>

      <Button title="🔈 문장 듣기" onPress={handleSpeak} />
      <Button title="🧩 Chunk 단위로 듣기" onPress={handleSpeakChunks} color="#ff8800" />

      {chunks.length > 0 && (
        <View style={styles.chunkContainer}>
          <Text style={styles.chunkTitle}>문장 Chunk</Text>
          {chunks.map((chunk, index) => (
            <Text
              key={index}
              style={[
                styles.chunkText,
                index === currentChunkIndex && styles.chunkHighlight
              ]}
            >
              {chunk}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.inputBox}>
        <Text style={styles.inputText}>{userWords.join(' ')}</Text>
      </View>

      <View style={styles.keyboard}>
        {QWERTY_KEYS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyRow}>
            {row.map((char) => (
              <TouchableOpacity
                key={char}
                disabled={!validKeys.includes(char)}
                onPress={() => handlePressKey(char)}
                style={[
                  styles.key,
                  validKeys.includes(char)
                    ? styles.keyHighlight
                    : styles.keyFaded,
                ]}
              >
                <Text style={styles.keyText}>{char}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button title="정답 확인" onPress={handleCheck} />
        <Button title="다시 입력" onPress={handleReset} color="#aaa" />
        <Button title="➡️ 다음 문장" onPress={handleNext} color="#28a745" />
      </View>

      <Text style={styles.result}>{result}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, marginBottom: 10 },
  sentenceHint: { fontSize: 14, color: '#777', marginBottom: 10 },
  inputBox: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    minHeight: 60,
    justifyContent: 'center',
  },
  inputText: { fontSize: 24, letterSpacing: 1 },
  keyboard: { marginTop: 20 },
  keyRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  key: {
    padding: 10,
    margin: 4,
    borderRadius: 5,
    minWidth: 35,
    alignItems: 'center',
  },
  keyHighlight: { backgroundColor: '#ccc' },
  keyFaded: { backgroundColor: '#eee', opacity: 0.4 },
  keyText: { fontSize: 18 },
  actions: { marginTop: 20, gap: 10 },
  result: { fontSize: 20, marginTop: 20, textAlign: 'center' },
  chunkContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  chunkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chunkText: {
    fontSize: 16,
    marginBottom: 3,
    color: '#000',
  },
  chunkHighlight: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  menuButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default GameScreen;
