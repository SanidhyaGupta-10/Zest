"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { syncUser } from "../lib/api";

export const useUserSync = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");

      return syncUser(token);
    },
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    if (mutation.isSuccess) return; // prevent repeat

    mutation.mutate();
  }, [isLoaded, isSignedIn, user?.id]);

  return mutation;
};