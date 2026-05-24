import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { authApi } from "../lib/api";

/**
 * Keep backend user profile synchronized with the authenticated Clerk user.
 */
export const useUserSync = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const hasSynced = useRef(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Missing Token");
      return authApi.syncUser(token);
    },
    onSuccess: () => { hasSynced.current = true; }
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !hasSynced.current && !mutation.isPending) {
      mutation.mutate();
    }
  }, [isLoaded, isSignedIn, user, mutation]);

  return mutation;
};
