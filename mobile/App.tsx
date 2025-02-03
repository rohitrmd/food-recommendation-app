import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { RecommendationsScreen } from './src/screens/RecommendationsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Food Recommendations' }}
        />
        <Stack.Screen 
          name="Recommendations" 
          component={RecommendationsScreen}
          options={{ title: 'Your Recommendations' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
