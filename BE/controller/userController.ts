import { db1004 } from "../dao/db1004";

type userInfo = {
    email: string,
    password: string,
    name: string
}

function userController(req, res) {
    const userData: userInfo = req.body as userInfo;
    const table = "users";
    const columns = ["email", "password", "name"];
    const values = [userData.email, userData.password, userData.name];
    try {
        db1004.insert({ table, columns, values });
        res
            .setStatus(302)
            .send();
    } catch (e) {
        res
            .setStatus(400)
            .send();
    }
}


export { userController }