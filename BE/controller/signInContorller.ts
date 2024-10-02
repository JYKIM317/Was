import { md5Encryption } from "../util/crypto";
import { UserRepository } from "../repository/UserRepository";

type signInInfo = {
    email: string,
    password: string,
}

function signInController(req, res) {
    const userData: signInInfo = req.body as signInInfo;
    const [email, password] = [userData.email, md5Encryption(userData.password)];

    //TODO: req.headers.Cookie.sid 가 세션에 존재한다면 세션 데이터 반환

    try {
        UserRepository.getUser(email).then((response) => {
            const result = response[0][0];
            const userExist = result != null;
            if (userExist) {
                if (password === result.password) {
                    res
                        .setStatus(302)
                        .send();
                } else {
                    res
                        .setStatus(400)
                        .send();
                }

            } else {
                res
                    .setStatus(400)
                    .send();
            }
        });
    } catch (e) {
        res
            .setStatus(500)
            .send();
    }
}


export { signInController }