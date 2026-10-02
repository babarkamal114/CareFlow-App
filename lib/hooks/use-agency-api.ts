import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation, useApiQuery } from "./use-api";
import { apiClient } from "../api";
import { env } from "@/config/env";

export interface CreateAgencyVariables {
  name: string;
  slug?: string; 
  logo?: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
  accessToken : string;
}

export interface CreateAgencyResponse {
  success: boolean;
  message: string;
  agencyId: string;
}

export interface GetAgencyByUserIdResponse {
  agency : {id: string;
  name: string;
  slug: string;
  logo: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postcode: string | null;
  status: "ACTIVE" | "SUSPENDED";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;}
}

const allAgencyKeys = ['agency', 'all']


export function useCreateAgencyApi(
    options?: Parameters<typeof useApiMutation<CreateAgencyResponse, CreateAgencyVariables>>[0]
){
    const queryClient = useQueryClient()
    return useApiMutation<CreateAgencyResponse, CreateAgencyVariables>({
        mutationKey: [...allAgencyKeys],
        mutationFn: ({name , slug, address,city,logo,phone,postcode, accessToken}) => {
                  return apiClient.post(
        `${env.NEXT_PUBLIC_API_URL}/agency/create`,
        {
          name: name,
          slug: slug,
          logo: logo,
          phone: phone,
          address: address,
          city: city,
          postcode: postcode,
        },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...allAgencyKeys]
            })
        },
        showErrorToast: true,
        ...options
    })
}

export function useGetAgencyByUserIdApi(accessToken : string){
  return useApiQuery<GetAgencyByUserIdResponse>(
    [...allAgencyKeys],
    () => {
      return apiClient.get(`${env.NEXT_PUBLIC_API_URL}/agency/get-by-userId`, {
        Authorization: `Bearer ${accessToken}`
      })
    }
  )
}