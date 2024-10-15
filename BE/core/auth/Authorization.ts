import { encrypt, decrypt, createIntegrityTag } from "./crypto"

enum GradeType {
    ADMIN = 0,
    USER = 1
}

type TokenType = "Access" | "Refresh";

type TokenBody = {
    iat: Date,
    exp: Date,
    grd: number,
    typ: TokenType,
    aud: string
};

class Authorization {
    static generateToken(tokenType: TokenType, aud: string) {
        const iat = new Date();
        const exp = new Date();
        tokenType === "Access"
            ? exp.setMinutes(exp.getMinutes() + 15)
            : exp.setDate(exp.getDate() + 61);
        const grd = GradeType.USER;
        const typ = tokenType;
        const body: TokenBody = { iat, exp, grd, typ, aud };

        const token = [
            encrypt(process.env.SECRET),
            encrypt(JSON.stringify(body)),
            createIntegrityTag(process.env.SECRET, JSON.stringify(body))
        ].join('.');

        return token;
    }

    static tokenRefresh(refreshToken) {
        const tokenVerifyResult = this.verifyToken(refreshToken, "Refresh");
        if (tokenVerifyResult) {
            const [_, bodyOfToken] = refreshToken.split(".");
            const bodyJsonString = decrypt(bodyOfToken);
            return this.generateToken("Access", JSON.parse(bodyJsonString).aud);
        }
        else return false;
    }

    static verifyToken(token, tokenType: TokenType) {
        const now = new Date();
        const [secretOfToken, bodyOfToken, integrityTag] = token.split(".");
        const secret = decrypt(secretOfToken);
        const bodyJsonString = decrypt(bodyOfToken);
        const thisContentIntegrityTag = createIntegrityTag(secret, bodyJsonString);
        const body = JSON.parse(bodyJsonString) as TokenBody;
        const exp = new Date(body.exp);

        if (secret !== process.env.SECRET) throw new Error(`Invalid ${tokenType} Token`);
        if (thisContentIntegrityTag !== integrityTag) throw new Error(`Invalid ${tokenType} Token`);
        if (body.typ !== tokenType) throw new Error(`Invalid ${tokenType} Token`);
        if (exp.getTime() < now.getTime()) return false;
        return true;
    }
}

export default Authorization