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
        const tokenVerifyResult = this.verifyToken(refreshToken, "Refresh");
        if (tokenVerifyResult) return this.generateToken("Access");
        else return false;
    }

    static verifyToken(token, tokenType: TokenType) {
        const now = new Date();
        const [secretOfToken, bodyOfToken, integrityTag] = token.split(".");
        const secret = decrypt(secretOfToken);
        const bodyJSON = decrypt(bodyOfToken);
        const thisContentIntegrityTag = createIntegrityTag(secret, bodyJSON);
        const body = JSON.parse(bodyJSON) as TokenBody;
        const exp = new Date(body.exp);

        if (secret !== process.env.SECRET) throw new Error(`Invalid ${tokenType} Token`);
        if (thisContentIntegrityTag !== integrityTag) throw new Error(`Invalid ${tokenType} Token`);
        if (body.typ !== tokenType) throw new Error(`Invalid ${tokenType} Token`);
        if (exp.getTime() < now.getTime()) return false;
        return true;
    }
}

export default Authorization