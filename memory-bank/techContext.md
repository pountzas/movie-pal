# Technical Context

## Technology Stack

### Core Framework

- **React Native 0.81.4**: Latest stable React Native version
- **Expo SDK 54**: Managed workflow for cross-platform development
- **TypeScript 5.9.2**: Type safety and developer experience

### State Management

- **Zustand 5.0.5**: Lightweight state management with persistence
- **AsyncStorage**: Local data persistence for offline support

### Styling & UI

- **Nativewind 4.1.23**: Tailwind CSS utilities for React Native
- **React Native Safe Area Context**: Handle device safe areas
- **Expo Vector Icons**: Consistent iconography across platforms

### Navigation

- **Expo Router 6.0.9**: File-based routing for React Native
- **React Navigation**: Screen transitions and navigation state

### API & Networking

- **Axios 1.9.0**: HTTP client for TMDb API integration
- **TMDb API**: Movie database with comprehensive movie information

### Development Tools

- **ESLint**: Code linting and style enforcement
- **TypeScript**: Type checking and IntelliSense
- **Expo CLI**: Development server and build tools
- **Jest**: Testing framework for unit and integration tests
- **React Native Testing Library**: Testing utilities for React Native components

## Development Environment

- **Node.js v16+**: JavaScript runtime
- **npm**: Package management
- **Git**: Version control

## Project Structure

```
movie-pal/
├── actions/           # API calls and data fetching
├── app/              # Screen components (Expo Router)
├── components/       # Reusable UI components
├── store/            # Zustand state management
├── assets/           # Images, fonts, icons
├── memory-bank/      # Project documentation
└── Configuration files
```

## Key Dependencies Rationale

### Why Zustand?

- Lightweight alternative to Redux/Context
- Built-in persistence middleware
- Simple API for state management
- Excellent TypeScript support

### Why Nativewind?

- Consistent with web development practices
- Faster development with utility classes
- Responsive design utilities
- Dark mode support out of the box

### Why Expo?

- Simplified development workflow
- Over-the-air updates capability
- Built-in access to device features
- Cross-platform consistency

### Why Expo Router?

- File-based routing (similar to Next.js)
- Native navigation performance
- Deep linking support
- Type-safe navigation

## Technical Constraints

- Must maintain compatibility with Expo SDK versions
- TMDb API rate limits (40 requests per 10 seconds)
- AsyncStorage size limits for offline data
- React Native threading model considerations
- Platform-specific UI/UX patterns
