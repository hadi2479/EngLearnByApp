//SentenceListScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, Alert } from 'react-native';

export default function SentenceListScreen({ navigation }) {
  const [sentences, setSentences] = useState([]);
  const [newSentence, setNewSentence] = useState('');

  useEffect(() => {
    fetchSentences();
  }, []);

  const fetchSentences = () => {
    fetch('http://localhost:8081/api/sentences')
      .then(response => response.json())
      .then(data => setSentences(data))
      .catch(error => console.error('Error fetching sentences:', error));
  };

  const addSentence = () => {
    if (!newSentence.trim()) return;
    fetch('http://localhost:8081/api/sentences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newSentence }),
    })
      .then(res => res.json())
      .then(() => {
        setNewSentence('');
        fetchSentences();
      })
      .catch(err => console.error('Error adding sentence:', err));
  };

  const deleteSentence = (id) => {
    Alert.alert('삭제 확인', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        onPress: () => {
          fetch(`http://localhost:8081/api/sentences/${id}`, { method: 'DELETE' })
            .then(() => fetchSentences())
            .catch(err => console.error('Error deleting sentence:', err));
        },
        style: 'destructive',
      },
    ]);
  };

  const renderItem = ({ item, index }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text style={{ fontSize: 16 }}>{item.text}</Text>
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <Button
          title="게임으로"
          onPress={() =>
            navigation.navigate('GameScreen', {
              sentences,      // 전체 문장 리스트
              currentIndex: index, // 현재 선택된 문장 인덱스
            })
          }
        />
        <View style={{ width: 10 }} />
        <Button title="삭제" color="red" onPress={() => deleteSentence(item._id)} />
      </View>
    </View>
  );

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>문장 목록</Text>

      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TextInput
          placeholder="문장을 입력하세요"
          value={newSentence}
          onChangeText={setNewSentence}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            flex: 1,
            paddingHorizontal: 10,
            marginRight: 10,
            height: 40,
          }}
        />
        <Button title="추가" onPress={addSentence} />
      </View>

      <FlatList
        data={sentences}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}


