import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/person";

export const getPersonDetails = async (
  personId: number
): Promise<PersonDetails> => {
  try {
    const response = await axios.get(`${BASE_URL}/${personId}`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
        append_to_response: "movie_credits",
      },
      timeout: 30000,
    });

    if (response.status !== 200) {
      throw new Error(`Error fetching person details: ${response.statusText}`);
    }

    if (!response.data || typeof response.data.id !== "number") {
      throw new Error("Invalid person response structure");
    }

    return response.data as PersonDetails;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Error fetching")) {
      throw error;
    }
    if (error instanceof Error && error.message.startsWith("Invalid person")) {
      throw error;
    }
    throw new Error("Unable to load actor details. Please try again.");
  }
};
