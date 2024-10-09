
import { logger } from "../logger";
import { UserRepository } from "../repository/UserRepository";
import { md5Encryption } from "../util/crypto";
import Authorization from "../core/auth/Authorization"

type signInInfo = {
    email: string,
    password: string,
}

function signInController(req, res) {
    const userData: signInInfo = req.body as signInInfo;
    const { email, password } = userData;
    const encryptionPW = md5Encryption(password);

    try {
        UserRepository.getUser(email).then((response) => {
            const result = response[0][0];
            const userExist = result != null;
            if (!userExist) return res.setStatus(400).send();
            if (encryptionPW !== result.password) return res.setStatus(400).send();

            const accessToken = Authorization.generateToken("Access");
            const refreshToken = Authorization.generateToken("Refresh");
            res.setStatus(200).json({ redirect: "/", accessToken, refreshToken });
        });
    } catch (e) {
        logger.error(e);
        res.setStatus(500).send();
    }
}


export { signInController }