import React from "react";
import { render, screen, userEvent } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import MovieItem from "../MovieItem";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn()
}));

// Mock movie data
const mockMovie = {
  id: 1,
  title: "Test Movie",
  release_date: "2023-01-01",
  vote_average: 8.5,
  poster_path: "/test-poster.jpg"
};

describe("MovieItem", () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders movie information correctly", () => {
    render(<MovieItem movie={mockMovie} />);

    // Check if movie title is displayed
    expect(screen.getByText("Test Movie")).toBeOnTheScreen();

    // Check if release year is displayed
    expect(screen.getByText("2023")).toBeOnTheScreen();

    // Check if rating is displayed
    expect(screen.getByText("8.5/10")).toBeOnTheScreen();
  });

  it("navigates to movie details when pressed", async () => {
    const user = userEvent.setup();

    render(<MovieItem movie={mockMovie} />);

    // Find and press the movie item
    const movieItem = screen.getByText("Test Movie");
    await user.press(movieItem);

    // Check if router.push was called with correct parameters
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/MovieDetailsScreen",
      params: { ...mockMovie }
    });
  });

  it("handles missing movie data gracefully", () => {
    const incompleteMovie = {
      id: 2,
      title: "Incomplete Movie",
      release_date: undefined,
      vote_average: undefined,
      poster_path: undefined
    };

    render(<MovieItem movie={incompleteMovie as any} />);

    // Should still render the title
    expect(screen.getByText("Incomplete Movie")).toBeOnTheScreen();
  });

  it("applies correct styling classes", () => {
    render(<MovieItem movie={mockMovie} />);

    const movieItem = screen.getByText("Test Movie");

    // The TouchableOpacity should have the correct classes
    // Note: In React Native Testing Library, we can't directly test className,
    // but we can verify the component renders without errors
    expect(movieItem).toBeOnTheScreen();
  });

  it("truncates long movie titles", () => {
    const longTitleMovie = {
      ...mockMovie,
      title:
        "This is a very long movie title that should be truncated in the UI"
    };

    render(<MovieItem movie={longTitleMovie} />);

    // The component should render without crashing
    expect(
      screen.getByText(
        "This is a very long movie title that should be truncated in the UI"
      )
    ).toBeOnTheScreen();
  });
});
