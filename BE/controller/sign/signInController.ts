
import { logger } from "../../logger";
import { UserRepository } from "../../repository/UserRepository";
import Authorization from "../../core/auth/Authorization"
import bcrypt from "bcrypt"

type signInInfo = {
    email: string,
    password: string,
}

function signInController(req, res) {
    const userData: signInInfo = req.body as signInInfo;
    const { email, password } = userData;

    try {
        UserRepository.getUser(email).then((response) => {
            const result = response[0];
            const userExist = result != null;
            if (!userExist) return res.setStatus(400).send();
            if (!bcrypt.compareSync(password, result.password)) return res.setStatus(400).send();

            const accessToken = Authorization.generateToken("Access", email);
            const refreshToken = Authorization.generateToken("Refresh", email);
            res.setStatus(200).json({ redirect: "/", accessToken, refreshToken });
        });
    } catch (e) {
        logger.error(e);
        res.setStatus(500).send();
    }
}


export { signInController }