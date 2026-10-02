import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api";
import { useApiMutation } from "./use-api";
import { useSession } from "next-auth/react";

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface LogoutVariables {
  refreshToken: string;
  accessToken: string;
}

const logoutKeys = ['auth', 'logout'] as const;

import { type UseMutationResult } from "@tanstack/react-query";
export function useLogoutMutation(
  options?: Parameters<typeof useApiMutation<LogoutResponse, LogoutVariables>>[0]
): UseMutationResult<LogoutResponse, Error, LogoutVariables, unknown> {
  const queryClient = useQueryClient();
  const {update} = useSession()

  return useApiMutation<LogoutResponse, LogoutVariables>({
    mutationKey: [...logoutKeys],
    mutationFn: ({ refreshToken, accessToken }) => {
      return apiClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        { refreshToken },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );
    },
    onSuccess: async () => {
  
      queryClient.clear();
      await update(null)
    },
    showErrorToast: true,
    ...options,
  });
}