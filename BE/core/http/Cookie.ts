
type CookieSameSiteOption = "Strict" | "Lax" | "None";

type CookieOption = {
    Domain?: string;
    Expires?: Date;
    HttpOnly?: boolean;
    "Max-Age"?: number;
    Path?: string;
    Secure?: boolean;
    SameSite?: CookieSameSiteOption;
    Partitioned?: boolean;
}

function cookieParser(cookieString) {
    const cookies = cookieString.split(";");
    const cookieObject = cookies.reduce((obj, thisCookie) => {
        const [key, value] = thisCookie.trim().split("=");
        obj[key] = value;
        return obj;
    }, {});

    return cookieObject;
}

export { CookieOption, cookieParser }