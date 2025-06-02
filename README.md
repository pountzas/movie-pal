# MoviePal

A React Native (Expo) app that fetches and displays movies from The Movie Database (TMDb) API in a clean, scrollable dashboard, with offline support, search, dark mode, and user-friendly error handling.

---

## 🚀 Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/) (if cloning from GitHub)
- TMDb API Key (set as `EXPO_PUBLIC_TMDB_API_KEY` in your environment)
  ```https://developer.themoviedb.org/docs/getting-started```

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/movie-pal.git
cd movie-pal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the App

```bash
npx expo start
```

- Scan the QR code with the Expo Go app (iOS/Android) or run on an emulator or press `a` for Android or `i` for iOS in the terminal.

---

## 🛠 Tech Stack and Libraries Used

- **React Native (Expo):** Rapid cross-platform development.
- **Zustand:** Lightweight, scalable state management.
- **Nativewind:** Utility-first styling for React Native.
- **AsyncStorage:** Local data persistence and offline support.
- **React Navigation (expo-router):** Seamless screen transitions and navigation.
- **TMDb API:** Public movie data source.

**Why these choices?**

- **Zustand** is simple, fast, and easy to persist for offline support.
- **Nativewind** enables rapid, modern UI development.
- **AsyncStorage** provides robust offline caching with minimal setup.

---

## 🏗 Architecture & Folder Structure Overview

```
/src
  /actions      # API calls and data fetching logic
  /components   # Reusable UI components (Card, Search, List, etc.)
  /store        # Zustand store setup and logic
  /app          # App screens (Dashboard, Detail)
  /assets       # Icons, images, fonts
  /utils        # Utility functions/helpers
/App.js         # Entry point
```

**Rationale:**
The project uses a feature-based structure for scalability and maintainability. Shared logic and UI are separated for reusability and clarity.

---

## ⚖️ Trade-offs or Known Issues

- **Time vs. Complexity:** Focused on core requirements and clean UI, some bonus features (e.g., advanced animations, exhaustive tests) have not been done due to time constraints.
- **UI bug:** When the device is by default in dark mode, the notification bar's icons are set to dark icons making the almost invisible, but if you toggle the the theme to light and then back to dark, the icons get the correct color.

---

## 📝 Workflow Description

- **Approach:**

  1. Broke down requirements into tasks (API integration, UI, navigation, offline support).
  2. Set up the project structure and installed dependencies.
  3. Built the dashboard and detail screens with loading/error states.
  4. Added offline caching and user feedback.
  5. Polished UI and added optional features as time allowed.

- **Tools Used:**

  - **Version Control:** Git & GitHub
  - **Debugging:** React Native Debugger, Expo DevTools

- **Feature Validation:**
  - Manual testing on Android/iOS devices and emulators.

---

## 🛡 Error Handling

The app provides user-friendly error handling for all network and data-fetching operations. If an error occurs while fetching movies or search results (such as a network failure or API error), a clear error message is displayed at the top of the list. Users are informed of the issue and can retry the operation using a provided button. This ensures a smooth user experience and prevents silent failures.

---

## 🌱 Future Enhancements

- Improved performance optimizations (e.g., image caching, background sync)
- Enhanced UI/UX polish and animations
- Testing
- Extended filtering, search, and sorting options
- User authentication and personalized watchlists
- Add cast and crew details in movie detail view (need to call differt API endpoint)
- Add more details in movie detail view (e.g., ratings, reviews, movie length)

---

## 📄 License

[MIT](LICENSE) (or your preferred license)

---

**Feel free to reach out for any questions or suggestions!**
