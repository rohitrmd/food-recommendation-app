import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRecommendations } from '../store/recommendationsSlice';

export function RecommendationsScreen({ route }: any) {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.recommendations);
  
  const { latitude, longitude, mood } = route.params;

  useEffect(() => {
    dispatch(fetchRecommendations({ latitude, longitude, mood }));
  }, [dispatch, latitude, longitude, mood]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Finding the perfect food for your mood...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => dispatch(fetchRecommendations({ latitude, longitude, mood }))}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Food Recommendations</Text>
        <Text style={styles.subtitle}>Based on your {mood.toLowerCase()} mood</Text>
      </View>

      {items.length === 0 ? (
        <Text style={styles.noResults}>No recommendations found</Text>
      ) : (
        <View style={styles.recommendationsList}>
          {items.map((item, index) => (
            <View key={item.id || index} style={styles.recommendationCard}>
              <Text style={styles.recommendationName}>{item.name}</Text>
              <Text style={styles.recommendationDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recommendationsList: {
    padding: 15,
  },
  recommendationCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recommendationName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 30,
  },
}); 