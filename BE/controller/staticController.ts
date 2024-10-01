import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { statusMsg } from "../util/const";

const filePath = fileURLToPath(import.meta.url);
const staticFilePath = path.join(filePath, "../../../", "static");

function staticController(req, res) {
    const filePath = path.join(staticFilePath, req.path === '/' ? 'index.html' : req.path);
    try {
        res.setStatus(200);
        res.sendFile(filePath);
    } catch (e) {
        res.setStatus(404);
        res.send();
    }
}


export { staticController }