import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation, useApiQuery } from "./use-api";
import { apiClient } from "../api";
import { env } from "@/config/env";
import { Role, StaffMember } from "types";

export interface AddStaffVariables {
    fullname : string;
    email: string;
    roleId : string;
    phone? : string;
    accessToken : string;
    agencyId : string;
    password: string;
}

export interface AddStaffResponse {
    success: boolean;
    message : string;
    user: {
        email: string;
        fullName : string;
        role : string;
        userId : string
    }
}

export interface GetAllAgencyStaffResponse {
  agency_memberships: {
    id: string;
    agencyId: string;
    userId: string;
    roleId: string;
    status: "ACTIVE" | "SUSPENDED" | "ON_LEAVE" | "TERMINATED";
    invitedBy: string | null;
    invitedAt: Date | null;
    acceptedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  };
  users: {
    id: string;
    email: string;
    fullName: string;
    passwordHash: string;
    phone: string | null;
    picture: string | null;
    stripeCustomerId: string | null;
    emailVerified: boolean;
    emailVerifiedAt: Date | null;
    status: "ACTIVE" | "PENDING_VERIFICATION" | "VERIFIED" | "SUSPENDED" | "DELETED";
    needPasswordChange: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  };
  roles: Role
}

export function mapToStaffMember(
  response: GetAllAgencyStaffResponse
): StaffMember {
  return {
    id: response.agency_memberships.id,
    userId: response.agency_memberships.userId,
    name: response.users.fullName,
    email: response.users.email,
    phone: response.users.phone,
    profilePicture: response.users.picture,
    role: response.roles.name,
    status: response.agency_memberships.status,
    joinDate: response.agency_memberships.acceptedAt || response.agency_memberships.createdAt,
    invitedBy: response.agency_memberships.invitedBy,
    invitedAt: response.agency_memberships.invitedAt,
    acceptedAt: response.agency_memberships.acceptedAt,
    createdAt: response.agency_memberships.createdAt,
    updatedAt: response.agency_memberships.updatedAt,
    deletedAt: response.agency_memberships.deletedAt,
    userStatus: response.users.status,
    emailVerified: response.users.emailVerified,
  };
}

export function mapToStaffMemberArray(
  responses: GetAllAgencyStaffResponse[]
): StaffMember[] {
  return responses.map(mapToStaffMember);
}

const allStaffKeys = ['staff' , 'all'] as const

export function useAddStaffApi(
    options? : Parameters<typeof useApiMutation<AddStaffResponse, AddStaffVariables>>[0]
){
    const queryClient = useQueryClient()
    return useApiMutation<AddStaffResponse , AddStaffVariables>({
        mutationKey: [...allStaffKeys],
        mutationFn: ({email , fullname , roleId , phone, accessToken, agencyId,password}) => {
            return apiClient.post(`${env.NEXT_PUBLIC_API_URL}/agency/add-employee`,{
                email,
                fullname,
                roleId,
                phone,
                agencyId,
                password
            }, {
                Authorization : `Bearer ${accessToken}`
            })
        },
        showErrorToast: true,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...allStaffKeys]
            })
        },
        ...options
    })
}



export function useGetAllAgencyStaffApi(
    agencyId : string,
    accessToken: string
){
    return useApiQuery<GetAllAgencyStaffResponse[]>(
        [...allStaffKeys],
        () => {
            return apiClient.get(`${env.NEXT_PUBLIC_API_URL}/agency/get-all-employees?agencyId=${agencyId}`,{
                Authorization : `Bearer ${accessToken}`
            })
        },
    )
}