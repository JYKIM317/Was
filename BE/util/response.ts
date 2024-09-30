import { Response } from "../dto/Response.ts";

function notFoundResponse(req): Response {
    return new Response(404, req.headers.Connection ?? "close");
}

export { notFoundResponse }