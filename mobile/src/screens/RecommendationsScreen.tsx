import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function RecommendationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Recommendations</Text>
      <Text style={styles.subtitle}>Based on your current mood and location</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 