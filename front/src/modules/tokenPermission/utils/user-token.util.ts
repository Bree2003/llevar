import { ArrayModel } from "../models/user-token.model";

export type PermissionList = 
    "reader" |
    "ingestion-reader" |
    "marketplace-reader" |
    "file-upload" |
    "gcp-access" |
    "admin" |
    "platform-admin" |
    "marketplace-admin";

export const checkPermission = (
    userPermissions: ArrayModel[] | null | undefined,
    permission: PermissionList): boolean => {

    if (!userPermissions) {
        return false;
    }

    const userCheck = userPermissions.find((x) => x.id === permission);

    if (userCheck === undefined) {
        return false;
    }

    return true;
};

export const checkDomain = (
    userDomains: ArrayModel[] | null | undefined,
    domain: string): boolean => {

    if (!userDomains) {
        return false;
    }

    const userCheck = userDomains.find((x) => x.id === domain);

    if (userCheck === undefined) {
        return false;
    }

    return true;

};
