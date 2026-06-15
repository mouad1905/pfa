import { API_URLS, fetchData } from "./api";

export const login = async (email, password) => {
  const response = await fetch(API_URLS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || "Login failed");
  return data;
};

export const register = async (userData) => {
  return fetchData(API_URLS.REGISTER, {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const logout = async () => {
  return fetchData(API_URLS.LOGOUT, { method: "POST" });
};
