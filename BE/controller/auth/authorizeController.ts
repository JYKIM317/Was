import Authorization from "../core/auth/Authorization"
import { logger } from "../logger";

function verifyController(req, res) {
    try {
        const accesstoken = req.body.accessToken;
        const isVerified = Authorization.verifyToken(accesstoken, "Access");

        if (isVerified) {
            res.setStatus(200).send();
        } else {
            res.setStatus(401).send();
        }
    } catch (e) {
        logger.warn("e");
        res.setStatus(403).send();
    }
}

function tokenRefreshController(req, res) {
    try {
        const refreshToken = req.body.refreshToken;
        const accessToken = Authorization.tokenRefresh(refreshToken);
        if (accessToken) {
            res.setStatus(200).json({ accessToken });
        } else {
            res.setStatus(401).send();
        }
    } catch (e) {
        logger.warn(e);
        res.setStatus(403).send();
    }
}

export { verifyController, tokenRefreshController }