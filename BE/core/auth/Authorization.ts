import { encrypt, decrypt, createIntegrityTag } from "./crypto"

enum gradeType {
    ADMIN = 0,
    USER = 1
}

type TokenType = "Access" | "Refresh";

type TokenBody = {
    iat: Date,
    exp: Date,
    grd: number,
    typ: TokenType
};

class Authorization {
    static generateToken(tokenType: TokenType) {
        const iat = new Date();
        const exp = new Date();
        tokenType === "Access"
            ? exp.setMinutes(exp.getMinutes() + 15)
            : exp.setDate(exp.getDate() + 61);
        const grd = gradeType.USER;
        const typ = tokenType;
        const body: TokenBody = { iat, exp, grd, typ };

        const secretOfToken = encrypt(process.env.SECRET);
        const bodyOfToken = encrypt(JSON.stringify(body));
        const integrityTag = createIntegrityTag(process.env.SECRET, JSON.stringify(body));

        const token = `${secretOfToken}.${bodyOfToken}.${integrityTag}`;
        return token;
    }

    static tokenRefresh(refreshToken) {
        //TODO: RefreshToken exp 및 무결성 검증 후 generateAccessToken("ACCESS");
        return "";
    }

    static verifyAccessToken(accessToken) {
        const now = new Date();
        const [secretOfToken, bodyOfToken, integrityTag] = accessToken.split(".");
        const secret = decrypt(secretOfToken);
        const bodyJSON = decrypt(bodyOfToken);
        const thisContentIntegrityTag = createIntegrityTag(secret, bodyJSON);
        const body = JSON.parse(bodyJSON) as TokenBody;
        const exp = new Date(body.exp);

        if (secret !== process.env.SECRET) return false;
        if (thisContentIntegrityTag !== integrityTag) return false;
        if (body.typ !== "Access") return false;
        if (exp.getTime() < now.getTime()) throw new Error("Invalid Access Token");
        return true;
    }
}

export default Authorization