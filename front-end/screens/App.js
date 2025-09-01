import React from 'react';
import { View, StyleSheet } from 'react-native';
import StepCounter from '../components/Pedometer';

export default function App() {
  return (
    <View style={styles.container}>
      <StepCounter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
     backgroundColor: '#ffffff',
  },
});