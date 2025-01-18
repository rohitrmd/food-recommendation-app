# Food Recommendation App

An intelligent food recommendation system that suggests personalized meals based on:
- Current weather conditions at user's location
- Time of day
- User's mood

The app uses OpenAI's GPT-4 to provide contextually relevant food suggestions, considering factors like temperature, weather conditions, and whether it's breakfast, lunch, dinner, or late-night snack time.

## Project Components

### Backend Service
The backend is a Python-based service that:
- Integrates with OpenWeatherMap API for real-time weather data
- Uses OpenAI's GPT-4 for intelligent food recommendations
- Provides RESTful APIs for the frontend

[Backend Setup and Documentation](backend/README.md)

### Mobile App (Coming Soon)
A React Native mobile app that will:
- Get user's location for weather data
- Allow mood selection
- Display personalized food recommendations

## Example Recommendations

The system considers multiple factors to make recommendations. For example:
- On a hot afternoon when you're happy: Light, refreshing lunch options perfect for sharing
- During a cold rainy evening when you're bored: Novel, warming dinner choices
- Late night when you're looking for something light: Appropriate snack suggestions

## Project Status
- ✅ Backend API Development
- ✅ Weather Integration
- ✅ AI-Powered Recommendations
- 🚧 Mobile App Development (In Progress)
- 📋 User Authentication (Planned)

## Contributing
See [Backend Setup](backend/README.md) for development environment setup.

## License
[MIT License](LICENSE) 