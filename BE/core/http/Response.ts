import fs from 'fs';
import path from 'path';
import net from 'net';
import { statusMsg, contentType } from "../../util/const";
import { cookieOption } from "./Cookie";

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
            header += `Content-Type: text/plain; charset=UTF-8\r\n`;
            header += `Content-Length: ${Buffer.byteLength(data, "utf8")}\r\n`;
        }

        this.socketWrite(header, data);
    }

    sendFile(filePath) {
        if (!fs.existsSync(filePath)) throw new Error("File does not exist");
        const ext = path.extname(filePath);
        const file = fs.readFileSync(filePath);
        let header = this.setInitialHeaderOption();
        header += `Content-Type: ${contentType[ext]}; charset=UTF-8\r\n`;
        header += `Content-Length: ${Buffer.byteLength(file)}\r\n`;

        this.socketWrite(header, file);
    }

    json(data: object) {
        const body = JSON.stringify(data);
        let header = this.setInitialHeaderOption();
        header += `Content-Type: application/json\r\n`;
        header += `Content-Length: ${Buffer.byteLength(body, 'utf-8')}\r\n`;

        this.socketWrite(header, body);
    }

    redirect(url, statusCode = 302) {
        this.statusCode = statusCode;
        let header = this.setInitialHeaderOption();
        header += `Location: ${url}\r\n`;

        this.socketWrite(header);
    }

    setStatus(statusCode) {
        const message = statusMsg[statusCode];
        if (message) {
            this.statusCode = statusCode;
        } else {
            throw new Error("This status code does not exist")
        }

        return this;
    }

    setCookie(key: string, value, option?: cookieOption) {
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
        header += `Server: Jinyoung\r\n`;
        header += `Date: ${new Date().toUTCString()}\r\n`;
        header += `Connection: ${this.connection}\r\n`;
        if (this.connection.toLowerCase() === 'keep-alive') {
            header += `Keep-Alive: timeout=5, max=1000\r\n`;
        }
        if (this.cookie) {
            header += `Set-Cookie: ${this.cookie}\r\n`;
        }
        return header;
    }

    private socketWrite(header, body: Buffer | string = "\r\n") {
        if (!this.statusCode) throw new Error("Status code has not been set yet.");
        const startLine = `HTTP/1.1 ${this.statusCode} ${statusMsg[this.statusCode]}\r\n`;
        const emptyLine = "\r\n";

        this.socket.write(startLine);
        this.socket.write(header);
        this.socket.write(emptyLine);
        if (body) this.socket.write(body);
    }
}

