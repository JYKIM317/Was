import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import { CRLF } from "./const";

const filePath = fileURLToPath(import.meta.url);
const imageStoragePath = path.join(filePath, "../../../", "imageStorage");

function dateFormatParser(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


function parseMultipart(bodyBuffer: Buffer, contentType) {
    const [, boundary] = (contentType as string).split(";");
    const [, delimiter] = boundary.trim().split("boundary=");

    const bodyBufferSplit = splitBuffer(bodyBuffer, delimiter);
    const multipart = bodyBufferSplit.slice(1, -1);

    const CRLFBuffer = Buffer.from(CRLF);
    const multipartData = multipart.map((part) => {
        const partObject: { [key: string]: Buffer | string } = {};

        const headerPart = part.subarray(0, part.indexOf(`${CRLFBuffer}${CRLFBuffer}`));
        const bodyPart = part.subarray(part.indexOf(`${CRLFBuffer}${CRLFBuffer}`) + CRLFBuffer.length * 2);

        const headerPartSplit = splitBuffer(headerPart, CRLF);
        headerPartSplit.forEach((headerLine) => {
            const headerLineSplit = splitBuffer(headerLine, ";");
            headerLineSplit.forEach((attribute) => {
                let [key, value] = splitBuffer(attribute, ":");
                if (value == null) [key, value] = splitBuffer(attribute, "=");
                if (value != null) partObject[key.toString().toLowerCase().trim()] = value.toString().replaceAll("\"", "");
            });
        });
        partObject[partObject.name.toString()] = splitBuffer(bodyPart, "--")[0];

        if ((partObject["content-type"] ?? "").toString().trim().startsWith("image")) {
            if (!fs.existsSync(imageStoragePath)) fs.mkdirSync(imageStoragePath);
            fs.writeFileSync(path.join(imageStoragePath, partObject.filename.toString()), bodyPart);
        }

        return partObject;
    });

    return multipartData;
}

function splitBuffer(buffer: Buffer, delimiter: string) {
    const result = [buffer];
    let splitCount = 0;

    while (splitCount !== result.length) {
        splitCount++;
        const lastIndex = result.length - 1;
        const delimiterIndex = result[lastIndex].indexOf(Buffer.from(delimiter));

        if (delimiterIndex !== -1) {
            const separatedPart = result[lastIndex].subarray(0, delimiterIndex);
            const extraPart = result[lastIndex].subarray(delimiterIndex + Buffer.from(delimiter).length);
            result[lastIndex] = separatedPart;
            result.push(extraPart);
        }
    }

    return result;
}

export { dateFormatParser, parseMultipart }