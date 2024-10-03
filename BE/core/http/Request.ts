import { cookieParser } from "./Cookie";

export class Request {
    headers: { [key: string]: string | object } = {};
    body: string | { [key: string]: any };
    method: string;
    path: string;
    version: string;
    params: { [key: string]: string } = {};
    query: { [key: string]: string } = {};
    error?: string;

    constructor(msg) {
        this.parseMsg(msg);
    }

    private parseMsg(msg) {
        const [headerMsg, bodyMsg] = msg.split("\r\n\r\n");
        const [startLine, ...requestHeader] = headerMsg.split("\r\n");
        this.parseStartLine(startLine);
        this.parseHeader(requestHeader);
        this.parseBody(bodyMsg);
    }

    private parseStartLine(startLine) {
        [this.method, this.path, this.version] = startLine.split(' ');
    }

    private parseHeader(headerMsg) {
        headerMsg.forEach((line) => {
            const [key, value] = line.split(":");
            this.headers[key.toLowerCase()] = value.trim();
        });

        if (this.headers.cookie != null) {
            const cookieObject = cookieParser(this.headers.cookie);
            this.headers.cookie = cookieObject;
        }
    }

    private parseBody(bodyMsg) {
        const bodyMsgExist = bodyMsg !== "";
        const contentJSON = 'application/json';
        if (this.headers["content-type"] === contentJSON) {
            this.body = JSON.parse(bodyMsg);
        } else {
            this.body = bodyMsg;
        }

        if (bodyMsgExist) {
            const checkContentLength = this.headers["content-length"] === Buffer.byteLength(bodyMsg).toString();
            if (!checkContentLength) this.error = "Invalid Content-Length";
        }
    }
}