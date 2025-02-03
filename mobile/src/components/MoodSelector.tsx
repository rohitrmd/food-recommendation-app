import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

type Mood = 'Happy' | 'Sad' | 'Energetic' | 'Relaxed' | 'Hungry';

interface MoodSelectorProps {
  onSelectMood: (mood: Mood) => void;
  selectedMood: Mood | null;
}

export function MoodSelector({ onSelectMood, selectedMood }: MoodSelectorProps) {
  const moods: Mood[] = ['Happy', 'Sad', 'Energetic', 'Relaxed', 'Hungry'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.moodGrid}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[
              styles.moodButton,
              selectedMood === mood && styles.selectedMoodButton,
            ]}
            onPress={() => onSelectMood(mood)}
          >
            <Text 
              style={[
                styles.moodText,
                selectedMood === mood && styles.selectedMoodText,
              ]}
            >
              {mood}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  moodButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  selectedMoodButton: {
    backgroundColor: '#007AFF',
  },
  moodText: {
    fontSize: 16,
    color: '#333',
  },
  selectedMoodText: {
    color: '#fff',
  },
}); 