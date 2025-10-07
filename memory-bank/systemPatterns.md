# System Patterns & Architecture

## Architecture Overview

MoviePal follows a **feature-based architecture** with clear separation of concerns:

### Core Layers

1. **Presentation Layer** (`app/`): Screen components and navigation
2. **Business Logic Layer** (`store/`): State management and data flow
3. **Data Access Layer** (`actions/`): API calls and external data fetching
4. **UI Components Layer** (`components/`): Reusable UI components

## Key Technical Decisions

### State Management Pattern

- **Zustand Stores**: Separate stores for different concerns
  - `useMovieStore`: Popular movies with pagination and offline persistence
  - `useMovieSearchStore`: Search functionality with separate state
- **Persistence Strategy**: AsyncStorage with custom serialization
- **State Updates**: Immutable updates with spread operators

### Component Architecture

- **Functional Components**: Modern React with hooks
- **Component Composition**: Small, focused components that compose together
- **Props Interface**: TypeScript interfaces for component contracts
- **Styling**: Nativewind utility classes for consistent styling

### Data Flow Pattern

```
User Action → Component → Store Action → API Call → Store Update → Component Re-render
     ↓
Offline Cache ← AsyncStorage ← Zustand Persistence
```

### Error Handling Pattern

- **Try-Catch Blocks**: API calls wrapped in error boundaries
- **User-Friendly Messages**: Technical errors converted to user messages
- **Retry Mechanism**: Manual retry buttons for failed operations
- **Graceful Degradation**: App remains functional during errors

## Design Patterns

### Custom Hook Pattern

```typescript
// Store hooks encapsulate business logic
const useMovies = () => {
  const { movies, loading, fetchMovies } = useMovieStore();
  // Custom logic here
  return { movies, loading, fetchMovies };
};
```

### Container/Presentational Pattern

- **Container Components**: Handle data and state (screens in `app/`)
- **Presentational Components**: Focus on UI rendering (`components/`)

### Pagination Pattern

- **Infinite Scroll**: Load more data as user scrolls
- **Page-based API**: TMDb uses page-based pagination
- **Loading States**: Separate loading indicators for initial load vs. pagination

### Offline-First Pattern

- **Platform-Aware Storage**: Use AsyncStorage on native platforms, localStorage on web
- **Cache Strategy**: Store API responses in appropriate storage mechanism
- **Hydration**: Restore cached data on app launch across platforms
- **Sync Logic**: Background sync for fresh data when online

## Component Relationships

### Store Dependencies

```
useMovieStore
├── movies[]: Movie[]
├── loading: boolean
├── error: string | null
├── fetchMovies(): Promise<void>
└── reset(): void

useMovieSearchStore
├── searchedMovies[]: Movie[]
├── query: string
├── searchError: string | null
├── fetchSearchedMovies(query): Promise<void>
└── reset(): void
```

### Component Hierarchy

```
App (index.tsx)
├── Search (Search.tsx)
├── Theme Toggle (Switch)
└── MoviesList (MoviesList.tsx)
    └── MovieItem[] (MovieItem.tsx)
        └── MovieDetailsScreen (MovieDetailsScreen.tsx)
```

## Performance Patterns

### List Optimization

- **FlatList**: Virtualized scrolling for large lists
- **Key Props**: Stable keys for efficient re-rendering
- **Memoization**: React.memo for expensive components

### Image Optimization

- **Expo Image**: Advanced caching with memory-disk policy
- **Performance Features**: Placeholder images, content fit, downscaling
- **Responsive Images**: Different sizes for different contexts
- **Lazy Loading**: Images load as they come into viewport with recycling keys

### Bundle Optimization

- **Tree Shaking**: Only include used code
- **Dynamic Imports**: Code splitting where beneficial
- **Asset Optimization**: Compressed images and fonts

## Error Boundaries

### API Error Handling

```typescript
try {
  const data = await apiCall();
  updateStore({ data, error: null });
} catch (error) {
  updateStore({ error: "User-friendly message" });
} finally {
  updateStore({ loading: false });
}
```

### Network Error Recovery

- Detect network status changes
- Automatically retry failed requests
- Provide manual retry options
- Cache successful responses for offline use
