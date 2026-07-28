// Axios Instance: Pre-configured API client with baseline baseURL and credential flags.
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  withCredentials: true,
});
