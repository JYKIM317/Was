import { md5Encryption } from "../util/crypto";
import { UserRepository } from "../repository/UserRepository";
import { sha1Encryption } from "../util/crypto";

type signInInfo = {
    email: string,
    password: string,
}

function signInController(req, res) {
    const userData: signInInfo = req.body as signInInfo;
    const [email, password] = [userData.email, md5Encryption(userData.password)];

    //TODO: req.headers.Cookie.sid 가 세션에 존재한다면 세션 데이터 반환
    //
    try {
        UserRepository.getUser(email).then((response) => {
            const result = response[0][0];
            const userExist = result != null;
            if (userExist) {
                if (password === result.password) {
                    const sid = sha1Encryption(email);
                    res.setCookie("sid", sid, { HttpOnly: true });
                    //TODO: 세션에 sid 등록
                    //
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