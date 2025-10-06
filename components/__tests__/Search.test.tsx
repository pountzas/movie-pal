import React from "react";
import { render, screen } from "@testing-library/react-native";
import Search from "../Search";

// Mock the store completely before importing Search
jest.mock("../../store/store", () => ({
  useMovieSearchStore: jest.fn(() => ({
    fetchSearchedMovies: jest.fn(),
    reset: jest.fn(),
  })),
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("Search Component", () => {
  it("renders search input with correct placeholder", () => {
    render(<Search />);

    // Check if the search input is rendered with correct placeholder
    const searchInput = screen.getByPlaceholderText("Search movies...");
    expect(searchInput).toBeTruthy();
  });

  it("renders without crashing", () => {
    expect(() => render(<Search />)).not.toThrow();
  });
});
