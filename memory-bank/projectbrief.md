# MoviePal - React Native Movie Discovery App

## Project Overview

MoviePal is a React Native (Expo) mobile application that provides users with an intuitive way to discover and explore movies. The app fetches movie data from The Movie Database (TMDb) API and presents it in a clean, scrollable dashboard interface with offline support, search functionality, and dark mode.

## Core Requirements

- **Movie Discovery**: Display movies in a scrollable list sorted by popularity
- **Search Functionality**: Allow users to search movies by title
- **Offline Support**: Cache movie data locally using AsyncStorage
- **Dark Mode**: Provide theme switching capability
- **Error Handling**: Display user-friendly error messages for network failures
- **Cross-Platform**: Support iOS, Android, and Web platforms via Expo
- **Responsive Design**: Adapt to various screen sizes and orientations

## Technical Constraints

- Must use Expo framework for React Native development
- TMDb API integration with proper error handling
- State management using Zustand with persistence
- Styling with Nativewind (Tailwind CSS for React Native)
- TypeScript for type safety
- Navigation using Expo Router

## Success Criteria

- Clean, modern UI that works across platforms
- Fast loading with offline-first approach
- Intuitive search and navigation
- Robust error handling and user feedback
- Performance optimized for mobile devices

## Out of Scope

- User authentication and personalization
- Advanced filtering beyond basic search
- Social features (sharing, ratings, watchlists)
- Video playback functionality
- Advanced animations and micro-interactions
