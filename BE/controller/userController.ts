import { Response } from "../dto/Response.ts";
import { Request } from "../core/http/Request.ts";
import { db1004 } from "../dao/db1004.ts";

type userInfo = {
    email: string,
    password: string,
    name: string
}

function userController(req: Request): Response {
    const userData: userInfo = req.body as userInfo;
    const table = "users";
    const columns = ["email", "password", "name"];
    const values = [userData.email, userData.password, userData.name];
    try {
        db1004.insert({ table, columns, values });
        const response = new Response(302, req.headers.Connection ?? "close");
        return response;
    }
    catch {
        const response = new Response(404, req.headers.Connection ?? "close");
        return response;
    }
}


export { userController }