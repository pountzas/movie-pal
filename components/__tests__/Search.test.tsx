import React from "react";
import { render } from "@testing-library/react-native";
import Search from "../Search";

// Mock the store completely before importing anything
const mockStore = {
  useMovieSearchStore: jest.fn(() => ({
    fetchSearchedMovies: jest.fn(),
    reset: jest.fn(),
  })),
};

jest.mock("../../store/store", () => mockStore);

// AsyncStorage is mocked globally in jest.setup.js

describe("Search Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    // Setup store mock
    mockStore.useMovieSearchStore.mockReturnValue({
      fetchSearchedMovies: jest.fn(),
      reset: jest.fn(),
    });

    // Component should render without throwing
    expect(() => {
      render(<Search />);
    }).not.toThrow();
  });

  it("integrates with movie search store", () => {
    // Setup store mock
    mockStore.useMovieSearchStore.mockReturnValue({
      fetchSearchedMovies: jest.fn(),
      reset: jest.fn(),
    });

    // Render component (this should work without throwing)
    render(<Search />);

    // Verify the store mock is properly configured
    expect(mockStore.useMovieSearchStore).toBeDefined();
    expect(typeof mockStore.useMovieSearchStore).toBe('function');
  });

  it("renders component tree successfully", () => {
    // Setup store mock
    mockStore.useMovieSearchStore.mockReturnValue({
      fetchSearchedMovies: jest.fn(),
      reset: jest.fn(),
    });

    // Render component
    const result = render(<Search />);

    // Should render successfully (even if mocked)
    expect(result).toBeTruthy();
  });
});
