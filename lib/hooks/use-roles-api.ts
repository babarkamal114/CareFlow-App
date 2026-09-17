import { env } from "@/config/env";
import { apiClient } from "../api";
import { useApiQuery } from "./use-api";
import { Role } from "types";
import { formatRoleName } from "utils";

export interface GetAllRolesResponse {
  success: boolean;
  roles: Role[] | undefined;
}

export function mapRoleToDisplay(role: Role | undefined){
    return {
        id: role?.id,
        name : role?.name,
        displayName : formatRoleName(role?.name!)
    }
}

export function mapRolesToDisplay(roles: Role[] | undefined){
    if (!roles || !Array.isArray(roles)) {
    return [];
  }
    return roles?.map(mapRoleToDisplay)
}

const rolesKeys = ['roles', 'all']

export function useGetAllRolesApi(){
    return useApiQuery<GetAllRolesResponse>(
        [...rolesKeys],
        () => {
            return apiClient.get(`${env.NEXT_PUBLIC_API_URL}/users/all-roles`)
        }
    )
}