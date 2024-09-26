import { Response } from "../dto/Response.ts";
import { Request } from "../dto/Request.ts";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { statusMsg } from "../util/const.ts";

const filePath = fileURLToPath(import.meta.url);
const staticFilePath = path.join(filePath, "../../../", "static");

function staticController(req: Request): Response {
    const filePath = path.join(staticFilePath,  req.path === '/' ? 'index.html' : req.path);
    const ext = path.extname(filePath);

    if(fs.existsSync(filePath)){
        const file = fs.readFileSync(filePath, 'utf-8');
        const response = new Response(200, req.headers.Connection ?? "close", ext, file);
        return response;
    }
    const response = new Response(404, req.headers.Connection ?? "close");
    return response;
}


export {staticController}