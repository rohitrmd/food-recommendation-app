# Food Recommendation App - Mobile

Mobile application for the Food Recommendation system built with React Native and Expo.

## Prerequisites

Before running the app, make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

## Running on Different Platforms

After starting the development server, you have several options:

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: 
  1. Install "Expo Go" app on your device
  2. Scan the QR code shown in the terminal
  3. The app will open in Expo Go

## Development

- The main entry point is `App.tsx`
- TypeScript is configured for type safety
- Hot reloading is enabled by default

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

## Available Scripts

- `npm start` or `npx expo start`: Start the development server
- `npm run ios`: Start the app in iOS simulator
- `npm run android`: Start the app in Android emulator
- `npm run web`: Start the app in web browser

## Troubleshooting

If you encounter any issues, try the following:

1. Clear npm cache:
```bash
npm cache clean --force
```

2. Delete node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

3. Clear Expo cache:
```bash
npx expo start -c
```

## Additional Documentation

For more detailed setup and development instructions, see [INSTRUCTIONS.md](./INSTRUCTIONS.md)
