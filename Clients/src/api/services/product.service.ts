
import { ProductData } from "../../lib/types";
import apiClient from "../api.client";

interface ProductQueryParams {
  skinType?: string;
  concerns?: string[];
  page?: number;
  limit?: number;
}

interface CreateProductPayload {
  name: string;
  brand: string;
  description: string;
  ingredients: string;
  sustainabilityScore: number;
  allergens?: string;
  skinTypes: string[];
  concerns: string[];
  image?: File;
  externalUrl?: string;
}

const productService = {
  getProducts: async (
    params: ProductQueryParams = {}
  ): Promise<ProductData[]> => {
    const { data } = await apiClient.get("/api/products", { params });
    return data.products;
  },

  getProductById: async (id: string): Promise<ProductData> => {
    const { data } = await apiClient.get(`/api/products/${id}`);
    return data.product;
  },

  getRecommendedProducts: async (): Promise<ProductData[]> => {
    const { data } = await apiClient.get("/api/products/recommended");
    return data.products;
  },

  createProduct: async (
    payload: CreateProductPayload
  ): Promise<ProductData> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "skinTypes" || key === "concerns") {
        value.forEach((item: string) => formData.append(key + "[]", item));
      } else if (key === "image" && value) {
        formData.append("image", value);
      } else {
        formData.append(key, value.toString());
      }
    });

    const { data } = await apiClient.post("/api/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.product;
  },

  updateProduct: async (
    id: string,
    payload: Partial<CreateProductPayload>
  ): Promise<ProductData> => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if ((key === "skinTypes" || key === "concerns") && Array.isArray(value)) {
        value.forEach((item) => formData.append(`${key}[]`, item));
      } else if (key === "image" && value instanceof File) {
        formData.append("image", value);
      } else if (typeof value === "string" || typeof value === "number") {
        formData.append(key, value.toString());
      }
    });

    const { data } = await apiClient.put(`/api/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/products/${id}`);
  },
};

export default productService;
