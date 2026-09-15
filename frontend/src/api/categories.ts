import { API } from "./api";
import { apiFetch } from "./apiFetch";
import type { ApiResponse, Category } from "../types/custom";

export async function getCategories(): Promise<Category[]> {
  const response = await apiFetch(API.categories);

  const result: ApiResponse<Category[]> = await response.json();

  if (!response.ok || "error" in result) {
    throw new Error(
      "error" in result ? result.error : "Failed to fetch categories",
    );
  }

  return result.data;
}