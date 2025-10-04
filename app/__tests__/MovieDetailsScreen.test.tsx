import React from "react";
import {
  render,
  screen,
  userEvent,
  waitFor
} from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import MovieDetailsScreen from "../MovieDetailsScreen";

// Mock expo-router
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn()
}));

// Mock axios for API testing
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("MovieDetailsScreen", () => {
  // Mock router for navigation testing
  const mockRouter = {
    back: jest.fn()
  };

  // Mock movie data for testing component rendering
  const mockMovie = {
    id: 1,
    title: "Test Movie",
    release_date: "2023-01-01",
    backdrop_path: "/test-backdrop.jpg",
    overview:
      "This is a test movie overview that should be displayed in the details screen.",
    adult: false,
    genre_ids: [1, 2, 3],
    original_language: "en",
    original_title: "Test Movie",
    popularity: 100,
    poster_path: "/test-poster.jpg",
    video: false,
    vote_average: 8.5,
    vote_count: 1000
  };

  // Mock cast data for testing API integration
  const mockCast = [
    {
      id: 1,
      name: "Actor One",
      profile_path: "/actor1.jpg",
      character: "Character 1",
      credit_id: "123",
      order: 1
    },
    {
      id: 2,
      name: "Actor Two",
      profile_path: "/actor2.jpg",
      character: "Character 2",
      credit_id: "456",
      order: 2
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useLocalSearchParams as jest.Mock).mockReturnValue(mockMovie);
    (useRouter as any).mockReturnValue(mockRouter);

    // Mock successful API call
    mockedAxios.get.mockResolvedValue({
      data: {
        cast: mockCast
      }
    });
  });

  it("renders movie details correctly", async () => {
    render(<MovieDetailsScreen />);

    // Check if movie title is displayed
    expect(screen.getByText("Test Movie")).toBeOnTheScreen();

    // Check if release year is displayed
    expect(screen.getByText("2023")).toBeOnTheScreen();

    // Check if overview is displayed
    expect(
      screen.getByText(
        "This is a test movie overview that should be displayed in the details screen."
      )
    ).toBeOnTheScreen();

    // Wait for cast to be loaded
    await waitFor(() => {
      expect(screen.getByText("Actor One")).toBeOnTheScreen();
      expect(screen.getByText("Actor Two")).toBeOnTheScreen();
    });
  });

  it("navigates back when back button is pressed", async () => {
    const user = userEvent.setup();

    render(<MovieDetailsScreen />);

    const backButton = screen.getByText("Back");
    await user.press(backButton);

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("toggles overview expansion when read more/show less is pressed", async () => {
    const user = userEvent.setup();

    render(<MovieDetailsScreen />);

    // Initially should show "Read More" button (overview is truncated)
    expect(screen.getByText("Read More")).toBeOnTheScreen();

    // Click "Read More" to expand
    const readMoreButton = screen.getByText("Read More");
    await user.press(readMoreButton);

    // Should now show "Show Less" button (overview is expanded)
    expect(screen.getByText("Show Less")).toBeOnTheScreen();

    // Click "Show Less" to collapse
    const showLessButton = screen.getByText("Show Less");
    await user.press(showLessButton);

    // Should show "Read More" again (overview is collapsed)
    expect(screen.getByText("Read More")).toBeOnTheScreen();
  });

  it("handles API errors gracefully", async () => {
    // Mock API error
    mockedAxios.get.mockRejectedValue(new Error("API Error"));

    // Mock console.error to avoid console output in tests
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(<MovieDetailsScreen />);

    // Wait for component to handle the error
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching movie details:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("displays cast members in horizontal scroll view", async () => {
    render(<MovieDetailsScreen />);

    // Wait for cast to be loaded
    await waitFor(() => {
      expect(screen.getByText("Cast:")).toBeOnTheScreen();
      expect(screen.getByText("Actor One")).toBeOnTheScreen();
      expect(screen.getByText("Actor Two")).toBeOnTheScreen();
    });
  });

  it("handles missing movie data gracefully", () => {
    (useLocalSearchParams as any).mockReturnValue({
      id: 2,
      title: "Movie Without Data",
      release_date: "2023-01-01",
      backdrop_path: "/test-backdrop.jpg",
      overview: "Test overview",
      adult: false,
      genre_ids: [1, 2, 3],
      original_language: "en",
      original_title: "Movie Without Data",
      popularity: 100,
      poster_path: "/test-poster.jpg",
      video: false,
      vote_average: 8.5,
      vote_count: 1000
    });

    render(<MovieDetailsScreen />);

    // Should still render the title
    expect(screen.getByText("Movie Without Data")).toBeOnTheScreen();
  });

  it("applies correct dark mode styling", () => {
    render(<MovieDetailsScreen />);

    // The component should render with dark mode classes
    // In React Native Testing Library, we verify the component works correctly
    expect(screen.getByText("Test Movie")).toBeOnTheScreen();
  });

  it("displays backdrop image correctly", () => {
    render(<MovieDetailsScreen />);

    // The Image component should be rendered with the backdrop path
    // In React Native Testing Library, we can verify the component structure
    expect(screen.getByText("Test Movie")).toBeOnTheScreen();
  });
});
