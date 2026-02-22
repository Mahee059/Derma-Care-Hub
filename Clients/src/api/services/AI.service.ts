
import { AIRecommendation } from "../../lib/types";
import apiClient from "../api.client";

const aiService = {
  getRecommendations: async (): Promise<AIRecommendation> => {
    try {
      const { data } = await apiClient.get("/api/ai/recommendations");
      return {
        aiRecommendations: data.aiRecommendations || "",
        matchingProducts: data.matchingProducts || [],
      };
    } catch (error) {
      console.log(error);
      return {
        aiRecommendations:
          "We're currently experiencing issues with our AI recommendations. Please try again later.",
        matchingProducts: [],
      };
    }
  },
};

export default aiService;
