# Make sure you're in the mobile directory
cd mobile

# Create or update the file
cat > INSTRUCTIONS.md << 'EOL'
# Food Recommendation App - Mobile Setup Instructions

## Prerequisites
- Node.js installed
- npm installed
- Watchman installed (`brew install watchman`)

## Initial Setup

1. Create the mobile app using Expo:
```bash
npx create-expo-app mobile --template blank-typescript
```

2. Navigate to mobile directory:
```bash
cd mobile
```

3. Install dependencies:
```bash
npm install
```

4. Install Expo CLI globally:
```bash
npm install -g expo-cli
```

## Running the App

1. Start the development server:
```bash
npx expo start
```

2. You'll see a QR code and options to:
   - Press 'i' for iOS simulator
   - Press 'a' for Android emulator
   - Scan QR code with Expo Go app on your phone

## Project Structure
```
mobile/
├── App.tsx           # Main application component
├── app.json         # Expo configuration
├── babel.config.js  # Babel configuration
├── package.json     # Project dependencies
├── tsconfig.json    # TypeScript configuration
└── assets/         # Images and other static assets
```

## Troubleshooting

If you encounter "too many open files" error:
```bash
# Install watchman
brew install watchman

# Increase file watch limit
echo 'ulimit -n 10240' >> ~/.zshrc
source ~/.zshrc

# Clear watchman watches
watchman watch-del-all
```

## Development Notes
- Using Expo for easier development and testing
- TypeScript template for type safety
- Hot reloading enabled by default

## Next Steps
1. Set up navigation
2. Add Redux for state management
3. Create screens and components
4. Set up API integration with backend
EOL
