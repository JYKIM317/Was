import { statusMsg, contentType } from "../../util/const";
import fs from 'fs';
import path from 'path';
import net from 'net';

const emptyLine = "\r\n";

type cookieOption = {
    domain: string | null;
    expires: Date | null;
    httpOnly: boolean | null;
    maxAge: string | null;
    path: string | null;
    secure: string | null;
    signed: string | null;
}

export class Response {
    private socket: net.Socket;
    private statusCode: number = 0;
    private cookie: string;
    connection: string;

    constructor(socket, connection) {
        this.socket = socket;
        this.connection = connection ?? "close";
    }

    send() {
        if (!this.statusCode) throw new Error("Status code has not been set yet.");
        const startLine = `HTTP/1.1 ${this.statusCode} ${statusMsg[this.statusCode]}\r\n`;
        let header = this.setInitialHeaderOption();

        this.socket.write(startLine);
        this.socket.write(header);
        this.socket.write(emptyLine);
    }

    sendFile(filePath) {
        if (!this.statusCode) throw new Error("Status code has not been set yet.");
        if (!fs.existsSync(filePath)) throw new Error("File does not exist");
        const ext = path.extname(filePath);
        const file = fs.readFileSync(filePath);
        const startLine = `HTTP/1.1 ${this.statusCode} ${statusMsg[this.statusCode]}\r\n`;
        let header = this.setInitialHeaderOption();
        header += `Content-Type: ${contentType[ext]}; charset=UTF-8\r\n`;
        header += `Content-Length: ${Buffer.byteLength(file)}\r\n`;

        this.socket.write(startLine);
        this.socket.write(header);
        this.socket.write(emptyLine);
        this.socket.write(file);
    }

    json(data: object) {
        if (!this.statusCode) throw new Error("Status code has not been set yet.");
        const startLine = `HTTP/1.1 ${this.statusCode} ${statusMsg[this.statusCode]}\r\n`;
        const body = JSON.stringify(data);
        let header = this.setInitialHeaderOption();
        header += `Content-Type: application/json; charset=UTF-8\r\n`;
        header += `Content-Length: ${Buffer.byteLength(body, 'utf-8')}\r\n`;

        this.socket.write(startLine);
        this.socket.write(header);
        this.socket.write(emptyLine);
        this.socket.write(body);
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

    setCookie(key: string, value, option: cookieOption | null) {
        this.cookie = `${key}=${value};` + ` ${JSON.stringify(option)}`;
        return this;
    }

    private setInitialHeaderOption() {
        let header = "";
        header += `Server: Jinyoung\r\n`;
        header += `Date: ${new Date().toString()}\r\n`;
        header += `Connection: ${this.connection}\r\n`;
        if (this.connection === 'Keep-Alive') {
            header += `Keep-Alive: timeout=5, max=1000\r\n`;
        }
        return header;
    }
}

