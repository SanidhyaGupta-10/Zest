"use server"

import { User } from "@/types/api.types";
import { axiosInstance } from "./axios";

export const syncUserReq = async (token: string) => {
  const { data } = await axiosInstance.post("/users/sync", {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};