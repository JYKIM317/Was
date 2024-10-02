import { md5Encryption } from "../util/crypto";
import { UserRepository } from "../repository/UserRepository";

type signUpInfo = {
    email: string,
    password: string,
    name: string
}

function signUpController(req, res) {
    const userData: signUpInfo = req.body as signUpInfo;
    const [email, password, name] = [userData.email, md5Encryption(userData.password), userData.name];
    const emailRegexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$"
    const isEmailStandard = email.match(emailRegexp) != null;
    const isPasswordStandard = password.trim() !== "";
    const isNameStandard = name.trim() !== "";

    if (!isEmailStandard || !isPasswordStandard || !isNameStandard) res.setStatus(400).send();
    else try {
        UserRepository.getUser(email).then((response) => {
            const result = response[0][0];
            const emailAvailable = result == null;
            if (emailAvailable) {
                UserRepository.createUser(email, password, name);

                res
                    .setStatus(302)
                    .send();
            } else {
                res
                    .setStatus(409)
                    .send();
            }
        });
    } catch (e) {
        res
            .setStatus(400)
            .send();
    }
}


export { signUpController }