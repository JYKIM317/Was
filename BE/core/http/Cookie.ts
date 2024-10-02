
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

function cookieParser(header) {
    const cookieString = header.cookie;
    const cookies = cookieString.split(";");
    const cookieObject = cookies.reduce((obj, thisCookie) => {
        const [key, value] = thisCookie.trim().split("=");
        obj[key] = value;
        return obj;
    }, {});
    header.cookie = cookieObject;
}

export { cookieOption, cookieParser }