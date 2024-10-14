import { fetchGET } from "./fetch.js";

const url = "http://localhost:8080";

async function getBoardPage(page) {
    const uri = url + `/board/post?p=${page}`;
    return await fetchGET(uri).then((response) => {
        const isOK = 200;
        return response.status === isOK ? response.json() : { result: [] };
    });
}

export { getBoardPage }