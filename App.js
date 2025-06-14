//App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import VideoPracticeScreen from './screens/VideoPracticeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: '학습 선택' }} />
        <Stack.Screen name="GameScreen" component={GameScreen} options={{ title: 'Game 학습' }} />
        <Stack.Screen name="VideoPracticeScreen" component={VideoPracticeScreen} options={{ title: '동영상 학습' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
