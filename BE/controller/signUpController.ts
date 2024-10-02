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

    //TODO: email 정규표현식 검사 추가
    //
    try {
        UserRepository.getUser(email).then((response) => {
            const result = response[0][0];
            const emailAvailable = result == null;
            if (emailAvailable) {
                UserRepository.createUser(email, password, name);

                res
                    .setStatus(302)
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