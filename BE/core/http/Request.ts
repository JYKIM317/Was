import { cookieParser } from "./Cookie"
import { CRLF } from "../../util/const"
import { parseMultipart } from "../../util/parser";

export class Request {
    headers: { [key: string]: string | object } = {};
    body: string | { [key: string]: any };
    method: string;
    path: string;
    version: string;
    params: { [key: string]: string } = {};
    query: { [key: string]: string } = {};

    constructor(message: Buffer) {
        this.parseMessage(message);
    }

    private parseMessage(message: Buffer) {
        const emptyLineIndex = message.indexOf(Buffer.from(`${CRLF}${CRLF}`));
        const emptyLineLength = Buffer.from(`${CRLF}${CRLF}`).length;
        const [headerMessage, bodyMessage] = [message.subarray(0, emptyLineIndex), message.subarray(emptyLineIndex + emptyLineLength)];
        const [startLine, ...requestHeader] = headerMessage.toString().split(CRLF);

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

    private parseBody(bodyBuffer: Buffer) {
        const isContentLengthInvalid = (this.headers["content-length"] ?? "0") != bodyBuffer.length.toString();
        if (isContentLengthInvalid) throw new Error("Content-Length Invalid");

        const bodyMessage = bodyBuffer.toString();
        const contentJSON = 'application/json';
        const contentMultipart = 'multipart/form-data';

        if ((this.headers["content-type"] as string ?? "").startsWith(contentJSON)) {
            this.body = JSON.parse(bodyMessage);
        } else if ((this.headers["content-type"] as string ?? "").startsWith(contentMultipart)) {
            this.body = {};
            const multipartData = parseMultipart(bodyBuffer, this.headers["content-type"]);
            multipartData.forEach((part) => {
                if (part.name === "data") {
                    Object.assign(this.body, JSON.parse(part.data.toString()));
                } else if (part.name === "image") {
                    this.body["image"] = part.filename;
                }
            });
        } else {
            this.body = bodyMessage;
        }
    }
}