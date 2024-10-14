
import { logger } from "../../logger";
import { UserRepository } from "../../repository/UserRepository";
import { passwordEncryption } from "../../util/crypto";
import Authorization from "../../core/auth/Authorization"
import bcrypt from "bcrypt"

type signInInfo = {
    email: string,
    password: string,
}

function signInController(req, res) {
    const userData: signInInfo = req.body as signInInfo;
    const { email, password } = userData;
    const encryptionPW = passwordEncryption(password);

    try {
        UserRepository.getUser(email).then((response) => {
            const result = response[0][0];
            const userExist = result != null;
            if (!userExist) return res.setStatus(400).send();
            if (!bcrypt.compareSync(result.password, encryptionPW)) return res.setStatus(400).send();

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