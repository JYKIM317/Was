export class Request {
    headers: {[key: string]: string} = {};
    body: string;
    method: string;
    path: string;
    version: string;
    params: Array<string> = [];
    query: {[key: string]: string}= {};

    constructor(msg) {
        this.parseMsg(msg);
    }

    private parseMsg(msg) {
        const [headerMsg, bodyMsg] = msg.split("\r\n\r\n");
        const [startLine, ...requestHeader] = headerMsg.split("\r\n");
        this.body = bodyMsg;
        this.parseStartLine(startLine);
        this.parseHeader(requestHeader);
    }

    private parseStartLine(startLine) {
        [this.method, this.path, this.version] = startLine.split(' ');
    }

    private parseHeader(headerMsg) {
        headerMsg.forEach((line) => {
            const [key, value] = line.split(":");
            this.headers[key] = value.trim();
        });
    }
}