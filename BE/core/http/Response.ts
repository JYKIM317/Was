import fs from 'fs';
import path from 'path';
import net from 'net';
import { STATUS_MESSAGE, CONTENT_TYPE, CRLF } from "../../util/const";
import { CookieOption } from "./Cookie";

export class Response {
    private socket: net.Socket;
    private statusCode: number = 0;
    private cookie?: string;
    connection: string;

    constructor(socket, connection) {
        this.socket = socket;
        this.connection = connection ?? "close";
    }

    send(data?: string) {
        let header = this.setInitialHeaderOption();
        if (data) {
            header += `Content-Type: text/plain; charset=UTF-8${CRLF}`;
            header += `Content-Length: ${Buffer.byteLength(data, "utf8")}${CRLF}`;
        }

        this.socketWrite(header, data);
    }

    sendFile(filePath) {
        if (!fs.existsSync(filePath)) throw new Error("File does not exist");
        const ext = path.extname(filePath);
        const file = fs.readFileSync(filePath);
        let header = this.setInitialHeaderOption();
        header += `Content-Type: ${CONTENT_TYPE[ext]}; charset=UTF-8${CRLF}`;
        header += `Content-Length: ${Buffer.byteLength(file)}${CRLF}`;

        this.socketWrite(header, file);
    }

    json(data: object) {
        const body = JSON.stringify(data);
        let header = this.setInitialHeaderOption();
        header += `Content-Type: application/json${CRLF}`;
        header += `Content-Length: ${Buffer.byteLength(body, 'utf-8')}${CRLF}`;

        this.socketWrite(header, body);
    }

    redirect(url, statusCode = 302) {
        this.statusCode = statusCode;
        let header = this.setInitialHeaderOption();
        header += `Location: ${url}${CRLF}`;

        this.socketWrite(header);
    }

    setStatus(statusCode) {
        const message = STATUS_MESSAGE[statusCode];
        if (message) {
            this.statusCode = statusCode;
        } else {
            throw new Error("This status code does not exist")
        }

        return this;
    }

    setCookie(key: string, value, option?: CookieOption) {
        this.cookie = `${key}=${value}`;
        if (option) Object.keys(option).forEach((opt) => {
            if (typeof option[opt] !== 'boolean') {
                this.cookie += `; ${opt}=${option[opt]}`;
            } else if (option[opt]) {
                this.cookie += `; ${opt}`;
            }
        });
        return this;
    }

    private setInitialHeaderOption() {
        let header = "";
        header += `Server: Jinyoung${CRLF}`;
        header += `Date: ${new Date().toUTCString()}${CRLF}`;
        header += `Connection: ${this.connection}${CRLF}`;
        if (this.connection.toLowerCase() === 'keep-alive') {
            header += `Keep-Alive: timeout=5, max=1000${CRLF}`;
        }
        if (this.cookie) {
            header += `Set-Cookie: ${this.cookie}${CRLF}`;
        }
        return header;
    }

    private socketWrite(header, body: Buffer | string = CRLF) {
        if (!this.statusCode) throw new Error("Status code has not been set yet.");
        const startLine = `HTTP/1.1 ${this.statusCode} ${STATUS_MESSAGE[this.statusCode]}${CRLF}`;

        this.socket.write(startLine);
        this.socket.write(header);
        this.socket.write(CRLF);
        this.socket.write(body);
    }
}

