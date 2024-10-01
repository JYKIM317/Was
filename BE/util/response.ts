import { Response } from "../core/http/Response";

function notFoundResponse(req): Response {
    return new Response(404, req.headers.Connection ?? "close");
}

export { notFoundResponse }