import { Response } from "../dto/Response.ts";
import { Request } from "../dto/Request.ts";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { statusMsg } from "../util/const.ts";
import { db1004 } from "../dao/db1004.ts";

const filePath = fileURLToPath(import.meta.url);

function userController(req: Request): Response {
    console.log("userController");
    const { email, password, name } = req.query;

    const table = "users";
    const columns = ["email", "password", "name"];
    const values = [email, password, name];
    try{
        db1004.insert({table, columns, values});
    }
    catch{
        const response = new Response(404, req.headers.Connection ?? "close");
        return response;
    }
    const response = new Response(200, req.headers.Connection ?? "close");
    return response;
}


export {userController}