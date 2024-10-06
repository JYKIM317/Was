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
    const sid = req.headers.cookie != null ? req.headers.cookie.sid : "none";

    if (session.isExist(sid)) res.setStatus(200).send(session.get(sid));
    else try {
        UserRepository.getUser(email).then((response) => {
            const result = response[0][0];
            const userExist = result != null;
            const DAY = 60 * 60 * 24;

            if (!userExist) return res.setStatus(400).send();
            if (encryptionPW !== result.password) return res.setStatus(400).send();

            const sid = sha1Encryption(email + Date.now().toString());
            session.set(sid, result.id);
            res.setCookie("sid", sid, { HttpOnly: true, Path: "/", "Max-Age": 30 * DAY });
            res.setStatus(302).send();
        });
    } catch (e) {
        res.setStatus(500).send();
    }
}


export { signInController }