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
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Finding perfect recommendations for you...</Text>
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

  const renderContent = () => {
    if (!items || items.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noResults}>No recommendations found</Text>
        </View>
      );
    }

    return (
      <View style={styles.recommendationsList}>
        {items.map((item, index) => (
          <View key={item.id || index} style={styles.recommendationCard}>
            <Text style={styles.recommendationName}>{item.name}</Text>
            <Text style={styles.recommendationDescription}>{item.description}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Food Recommendations</Text>
        <Text style={styles.subtitle}>Based on your {mood.toLowerCase()} mood</Text>
      </View>
      {renderContent()}
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
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
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
    padding: 16,
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
  },
  noResults: {
    fontSize: 16,
    color: '#666',
  },
}); 