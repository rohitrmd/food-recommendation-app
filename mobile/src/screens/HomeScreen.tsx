import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { MoodSelector } from '../components/MoodSelector';

type Mood = 'Happy' | 'Sad' | 'Energetic' | 'Relaxed' | 'Hungry';

export function HomeScreen({ navigation }: any) {
  const { location, errorMsg } = useLocation();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const handleGetRecommendations = () => {
    if (location && selectedMood) {
      navigation.navigate('Recommendations', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        mood: selectedMood,
      });
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Recommendation App</Text>
      
      {!location ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          <MoodSelector
            selectedMood={selectedMood}
            onSelectMood={setSelectedMood}
          />
          
          <TouchableOpacity
            style={[
              styles.button,
              !selectedMood && styles.buttonDisabled,
            ]}
            onPress={handleGetRecommendations}
            disabled={!selectedMood}
          >
            <Text style={styles.buttonText}>Get Recommendations</Text>
          </TouchableOpacity>
        </>
      )}
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
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
}); 