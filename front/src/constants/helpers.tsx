import { ReactElement } from "react";
import { closeSnackbar, SnackbarKey } from "notistack";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { getOnSessionStorage } from "services/utils";

interface MicrosoftJwtPayload extends JwtPayload {
    upn: string | null | undefined;
    unique_name: string | null | undefined;
    name: string | null | undefined;
    given_name: string | null | undefined;
    family_name: string | null | undefined;
};

export interface UserData {
    email: string | null | undefined;
    name: string | null | undefined;
    username: string | null | undefined;
}

export const getUserData = (): UserData | undefined => {
    const token = getOnSessionStorage("accessToken");
    if (token !== null) {
        const data = jwtDecode<MicrosoftJwtPayload>(token);
        return {
            email: 'upn' in data ? data['upn'] : 'unique_name' in data ? data['unique_name'] : null,
            name: 'name' in data ? data['name'] : null,
            username: ('given_name' in data ? data['given_name'] : "") + " " + ('family_name' in data ? data['family_name'] : ""),
        };
    }
    return undefined;
};

export const closeSnackbarAction = (snackbarId: SnackbarKey | undefined): ReactElement => (
    <button onClick={() => { closeSnackbar(snackbarId) }}>
        Cerrar
    </button>
);
