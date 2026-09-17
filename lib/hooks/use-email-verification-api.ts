import { env } from "@/config/env";
import { apiClient } from "../api";
import { useApiMutation } from "./use-api";
import { useQueryClient } from "@tanstack/react-query";

export interface SendVerificationCodeApiResponse {
    success: boolean,
    message: string;
}

export interface SendVerificationCodeVariables {
    accessToken : string;
}

export interface VerifyUserEmailResponse {
    success: boolean,
    message : string
}

export interface VerifyUserEmailVariables {
    accessToken : string;
    code: string;
}

const sendVerificationCodeKeys = ['auth', 'email-verification'] as const


import { type UseMutationResult } from "@tanstack/react-query";

export function useSendVerificationCodeApi(
    options? : Parameters<typeof useApiMutation<SendVerificationCodeApiResponse, SendVerificationCodeVariables>>[0]
): UseMutationResult<SendVerificationCodeApiResponse, Error, SendVerificationCodeVariables, unknown> {
    const queryClient = useQueryClient()

    return useApiMutation<SendVerificationCodeApiResponse , SendVerificationCodeVariables>({
        mutationKey: [...sendVerificationCodeKeys],
        mutationFn: ({accessToken}) => {
            return apiClient.post(`${env.NEXT_PUBLIC_API_URL}/auth/send-code`,undefined, {
                Authorization: `Bearer ${accessToken}`
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...sendVerificationCodeKeys]
            })
        },
        showErrorToast: true,
        ...options
    })
}

export function useVerifyUserEmailApi(
    options?: Parameters<typeof useApiMutation<VerifyUserEmailResponse, VerifyUserEmailVariables>>[0]
): UseMutationResult<VerifyUserEmailResponse, Error, VerifyUserEmailVariables, unknown> {
    const queryClient = useQueryClient()
    return useApiMutation<VerifyUserEmailResponse, VerifyUserEmailVariables>({
        mutationKey: [...sendVerificationCodeKeys],
        mutationFn: ({accessToken , code}) => {
            return apiClient.post(`${env.NEXT_PUBLIC_API_URL}/auth/verify-email`,{
                code
            }, {
                Authorization: `Bearer ${accessToken}`
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...sendVerificationCodeKeys]
            })
        },
        showErrorToast: true,
        ...options
    })
}