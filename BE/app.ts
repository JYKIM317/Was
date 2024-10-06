import net from 'net';
import { logger } from './logger';
import { Request } from './core/http/Request';
import { Response } from './core/http/Response';
import { routeStack } from './core/router/RouteStack';
import { staticRouter } from './route/staticRouter';
import { userRouter } from './route/userRouter';
import { session } from './core/session/Session';

routeStack.use("/", staticRouter);
routeStack.use("/user", userRouter);

const server = net.createServer(socket => {
    socket.on("data", (data) => {
        const socketData = data.toString();
        const req = new Request(socketData);
        const res = new Response(socket, req.headers.connection);
        const router = routeStack.find(req.path);
        logger.debug(socketData);

        if (req.error != null) res.setStatus(400).send(req.error);
        else try {
            ifSidNotValidCookieInit(req, res);

            if (router) {
                router.handler(req, res);
            } else {
                res
                    .setStatus(404)
                    .send();
            }
        } catch (_) {
            res
                .setStatus(500)
                .send();
        } finally {
            if (res.connection.toLowerCase() != "keep-alive") socket.end();
        } //TODO: socket.on(”error”)
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`,);
});

function ifSidNotValidCookieInit(req, res) {
    const sid = req.headers.cookie != null ? req.headers.cookie.sid : "none";
    const ifSidNotValid = sid !== "none" && !session.isExist(sid);
    if (ifSidNotValid) {
        res.setCookie("sid", "Remove cookie", { HttpOnly: true, Path: "/", "Max-Age": 0 });
    }
}