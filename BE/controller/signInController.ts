import { session } from "../core/session/Session";
import { UserRepository } from "../repository/UserRepository";
import { md5Encryption } from "../util/crypto";
import { sha1Encryption } from "../util/crypto";

type signInInfo = {
    email: string,
    password: string,
}

function signInController(req, res) {
    const userData: signInInfo = req.body as signInInfo;
    const { email, password } = userData;
    const encryptionPW = md5Encryption(password);
    const sid = req.headers.cookie.sid;

    if (session.isExist(sid)) res.setStatus(200).send(session.get(sid));
    else try {
        UserRepository.getUser(email).then((response) => {
            const result = response[0][0];
            const userExist = result != null;
            if (userExist) {
                if (encryptionPW === result.password) {
                    const sid = sha1Encryption(email + Date.now().toString());
                    session.set(sid, result.id);
                    res.setCookie("sid", sid, { HttpOnly: true });
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