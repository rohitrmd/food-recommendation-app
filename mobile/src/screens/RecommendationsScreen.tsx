import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRecommendations } from '../store/recommendationsSlice';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

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
        <LottieView
          source={require('../assets/animations/hungry.json')}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
        <Text style={styles.loadingText}>Finding delicious food for you...</Text>
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
          <TouchableOpacity 
            key={item.id || index} 
            style={styles.recommendationCard}
            onPress={() => {/* Handle navigation to detail view */}}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardNumberBadge}>
                <Text style={styles.cardNumberText}>{index + 1}</Text>
              </View>
              <Icon name="star" size={24} color="#FFD700" style={styles.starIcon} />
            </View>
            
            <Text style={styles.recommendationName}>{item.name}</Text>
            
            <View style={styles.cardTags}>
              <View style={styles.tag}>
                <Icon name="clock-outline" size={16} color="#666" />
                <Text style={styles.tagText}>Open Now</Text>
              </View>
              <View style={styles.tag}>
                <Icon name="map-marker" size={16} color="#666" />
                <Text style={styles.tagText}>2.5 km</Text>
              </View>
            </View>
            
            <Text style={styles.recommendationDescription}>{item.description}</Text>
            
            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="directions" size={20} color="#007AFF" />
                <Text style={styles.actionButtonText}>Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="phone" size={20} color="#007AFF" />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Food Recommendations</Text>
        <Text style={styles.subtitle}>Based on your {mood.toLowerCase()} mood</Text>
        <View style={styles.moodBadge}>
          <Icon name="emoticon-happy" size={20} color="#007AFF" />
          <Text style={styles.moodText}>{mood}</Text>
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    marginTop: 20,
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
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardNumberBadge: {
    backgroundColor: '#007AFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  starIcon: {
    marginLeft: 'auto',
  },
  recommendationName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  cardTags: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  recommendationDescription: {
    fontSize: 15,
    color: '#4a4a4a',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionButtonText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '500',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  moodText: {
    marginLeft: 6,
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  noResults: {
    fontSize: 16,
    color: '#666',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
}); 