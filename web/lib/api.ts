import { User } from "@/types/api.types";
import { axiosInstance } from "./axios";

export const syncUser = async (token: string): Promise<User> => {
  const { data } = await axiosInstance.post<User>(
    "/users/sync",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};