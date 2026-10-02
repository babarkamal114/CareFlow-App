import { Permission } from "types";
import { useApiMutation, useApiQuery } from "./use-api";
import { apiClient } from "../api";
import { env } from "@/config/env";
import { useQueryClient } from "@tanstack/react-query";

export interface GrantUserPermissionsResponse {
    success: boolean;
    message : string;
    added : number
}

export interface GrantUserPermissionsVariables {
    agencyId : string;
    accessToken : string;
    permissions : Record<string , string[]>
}

const userPermissionsKeys = (staffId: string) => ['staff', staffId, 'permissions'] as const

export function useGetUserPermissionsApi(agencyId : string, staffId : string, accessToken : string){
    return useApiQuery<Permission[]>(
        [...userPermissionsKeys(staffId)],
        () => {
            return apiClient.get(`${env.NEXT_PUBLIC_API_URL}/permissions/user-permissions?agencyId=${agencyId}&staffId=${staffId}`, {
                Authorization : `Bearer ${accessToken}`
            })
        },
        
    )
}

export function useGrantUserPermissionsApi(
    staffId : string,
    options? : Parameters<typeof useApiMutation<GrantUserPermissionsResponse, GrantUserPermissionsVariables>>[0],
    
){
    const queryClient = useQueryClient()
    return useApiMutation<GrantUserPermissionsResponse, GrantUserPermissionsVariables>({
        mutationKey: [...userPermissionsKeys(staffId)],
        mutationFn: ({accessToken, agencyId, permissions }) => {
            return apiClient.patch(`${env.NEXT_PUBLIC_API_URL}/permissions/grant-permissions`, {
                staffId: staffId,
                agencyId: agencyId,
                permissions: permissions 
            }, {
                Authorization: `Bearer ${accessToken}`
            })
        },
        showErrorToast: true,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...userPermissionsKeys(staffId)]
            })
        },
        ...options
    })
}