import net from 'net';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger';

const filePath = fileURLToPath(import.meta.url);
const staticFilePath = path.join(filePath, "../../", "static");

const server = net.createServer(socket => {
    socket.on("data", (data) => {
        const request = data.toString();
        //logger.debug(request);
        if (request.includes("GET")) {
            const indexHtml = fs.readFileSync(path.join(staticFilePath, "html/index.html"), "utf8");

            socket.write("HTTP/1.1 200 OK\r\n");
            socket.write("Content-Type: text/html\r\n");
            socket.write("\r\n");
            socket.write(indexHtml);
            socket.end();
        }
    });
});

server.listen(3000, () => {
  console.log("HTTP server running on port 3000");
});