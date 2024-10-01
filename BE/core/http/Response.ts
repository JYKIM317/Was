import { statusMsg, contentType } from "../../util/const";

export class Response {
    responseMsg: string;
    constructor(statusCode, connection, ext: string | null = null, body: string | null = null) {
        this.setStatusLine(statusCode);
        this.setHeaders(connection, ext, body);
        this.setBody(body);
    }

    private setStatusLine(statusCode) {
        const startLine = `HTTP/1.1 ${statusCode} ${statusMsg[statusCode]}\r\n`;
        this.responseMsg = startLine;
    }

    private setHeaders(connection, ext, body) {
        this.responseMsg += `Server: Web29-A\r\n`;
        this.responseMsg += `Date: ${new Date().toUTCString()}\r\n`;
        if (body) {
            this.responseMsg += `Content-Type: ${contentType[ext]}; charset=UTF-8\r\n`;
            this.responseMsg += `Content-Length: ${Buffer.byteLength(body, 'utf-8')}\r\n`;
        }
        this.responseMsg += `Connection: ${connection}\r\n`;
        if (connection === 'Keep-Alive') {
            this.responseMsg += `Keep-Alive: timeout=5, max=1000\r\n`;
        }
        this.responseMsg += '\r\n';
    }

    private setBody(body) {
        this.responseMsg += body ?? "";
    }
}

