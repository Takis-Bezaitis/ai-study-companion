import { API } from "./api";
import { useAuthStore } from "../store/authStore";

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const { token, setToken, logout } = useAuthStore.getState();

  const headers = new Headers(init.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshResponse = await fetch(API.auth.refresh, {
    method: "POST",
    credentials: "include",
  });

  if (!refreshResponse.ok) {
    logout();
    window.location.href = "/auth/login";
    throw new Error("Session expired");
  }

  const refreshData = await refreshResponse.json();

  const newToken = refreshData.data.accessToken;

  setToken(newToken);

  headers.set("Authorization", `Bearer ${newToken}`);

  response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  return response;
}