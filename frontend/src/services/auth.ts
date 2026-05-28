// src/api/auth.ts
import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3000/build-resume",
  withCredentials: true,
});

export const loginUser = (data: { email: string; password: string }) =>
  API.post("/auth/login", data);

export const registerUser = (data: { email: string; password: string; name: string}) =>
  API.post("/auth/register", data);

export const logoutUser = () => {
  API.post("/auth/logout", {}, { withCredentials: true });
}

export const getCurrentUser = () => {
  return API.post("/auth/current-user", {}, { withCredentials: true });
}