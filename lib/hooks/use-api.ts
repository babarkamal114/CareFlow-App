'use client';

import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '../api';


export function useApiMutation<TData = unknown, TVariables = unknown>(
  options: UseMutationOptions<TData, Error, TVariables> & {
    mutationKey: readonly unknown[];
    mutationFn: (variables: TVariables) => Promise<TData>;
    showErrorToast?: boolean;
  },
) {
  const { showErrorToast = true, onError, ...rest } = options;
  return useMutation<TData, Error, TVariables>({
    ...rest,
    onError: (err, variables, onMutateResult, context) => {
      if (showErrorToast && err instanceof ApiError) {
        toast.error(err.message);
      } else if (showErrorToast && err instanceof Error) {
        toast.error(err.message);
      }
      onError?.(err, variables, onMutateResult, context);
    },
  });
}

export function useApiQuery<TData = unknown>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<TData, Error>({
    queryKey,
    queryFn,
    ...options,
  });
}
