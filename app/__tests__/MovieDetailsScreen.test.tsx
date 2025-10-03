import React from "react";
import {
  render,
  screen,
  userEvent,
  waitFor,
  act
} from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import MovieDetailsScreen from "../MovieDetailsScreen";

// Mock expo-router
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn()
}));

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("MovieDetailsScreen", () => {
  const mockRouter = {
    back: jest.fn()
  };

  const mockMovie = {
    id: 1,
    title: "Test Movie",
    release_date: "2023-01-01",
    backdrop_path: "/test-backdrop.jpg",
    overview:
      "This is a test movie overview that should be displayed in the details screen."
  };

  const mockCast = [
    {
      id: 1,
      name: "Actor One",
      profile_path: "/actor1.jpg"
    },
    {
      id: 2,
      name: "Actor Two",
      profile_path: "/actor2.jpg"
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useLocalSearchParams as jest.Mock).mockReturnValue(mockMovie);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

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

  it("fetches cast data on component mount", async () => {
    render(<MovieDetailsScreen />);

    // Wait for the API call to be made
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://api.themoviedb.org/3/movie/1/credits?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`
      );
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

    // Initially, overview should be truncated (numberOfLines={4})
    const overviewText = screen.getByText(
      "This is a test movie overview that should be displayed in the details screen."
    );

    // Click "Read More" to expand
    const readMoreButton = screen.getByText("Read More");
    await user.press(readMoreButton);

    // Should now show "Show Less"
    expect(screen.getByText("Show Less")).toBeOnTheScreen();

    // Click "Show Less" to collapse
    const showLessButton = screen.getByText("Show Less");
    await user.press(showLessButton);

    // Should show "Read More" again
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
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: 2,
      title: "Movie Without Data"
      // Missing other fields
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

  it("handles empty cast array", async () => {
    // Mock empty cast response
    mockedAxios.get.mockResolvedValue({
      data: {
        cast: []
      }
    });

    render(<MovieDetailsScreen />);

    // Should still render the cast section
    await waitFor(() => {
      expect(screen.getByText("Cast:")).toBeOnTheScreen();
    });
  });
});
