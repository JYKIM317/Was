import { cookieParser } from "./Cookie"
import { CRLF } from "../../util/const"

export class Request {
    headers: { [key: string]: string | object } = {};
    body: string | { [key: string]: any };
    method: string;
    path: string;
    version: string;
    params: { [key: string]: string } = {};
    query: { [key: string]: string } = {};
    error?: string;

    constructor(message) {
        this.parseMessage(message);
    }

    private parseMessage(message) {
        const [headerMessage, bodyMessage] = message.split(`${CRLF}${CRLF}`);
        const [startLine, ...requestHeader] = headerMessage.split(CRLF);
        this.parseStartLine(startLine);
        this.parseHeader(requestHeader);
        this.parseBody(bodyMessage);
    }

    private parseStartLine(startLine) {
        [this.method, this.path, this.version] = startLine.split(' ');
    }

    private parseHeader(headerMessage) {
        headerMessage.forEach((line) => {
            const [key, value] = line.split(":");
            this.headers[key.toLowerCase()] = value.trim();
        });

        if (this.headers.cookie != null) {
            const cookieObject = cookieParser(this.headers.cookie);
            this.headers.cookie = cookieObject;
        }
    }

    private parseBody(bodyMessage) {
        const bodyMessageExist = bodyMessage !== "";
        const contentJSON = 'application/json';
        if (this.headers["content-type"] === contentJSON) {
            this.body = JSON.parse(bodyMessage);
        } else {
            this.body = bodyMessage;
        }

        if (bodyMessageExist) {
            const checkContentLength = this.headers["content-length"] === Buffer.byteLength(bodyMessage).toString();
            if (!checkContentLength) this.error = "Invalid Content-Length";
        }
    }
}