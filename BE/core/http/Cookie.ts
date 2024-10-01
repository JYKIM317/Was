
type cookieSameSiteOption = "Strict" | "Lax" | "None";

type cookieOption = {
    Domain?: string;
    Expires?: Date;
    HttpOnly?: boolean;
    "Max-Age"?: number;
    Path?: string;
    Secure?: boolean;
    SameSite?: cookieSameSiteOption;
    Partitioned?: boolean;
}

export { cookieOption }