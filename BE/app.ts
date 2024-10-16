import net from 'net';
import { logger } from './logger';
import { Request } from './core/http/Request';
import { Response } from './core/http/Response';
import { routeStack } from './core/router/RouteStack';
import { staticRouter } from './route/staticRouter';
import { userRouter } from './route/userRouter';
import { session } from './core/session/Session';
import { authorizeRouter } from './route/authorizeRouter';
import { boardRouter } from './route/boardRouter';

routeStack.use("/", staticRouter);
routeStack.use("/user", userRouter);
routeStack.use("/authorization", authorizeRouter);
routeStack.use("/board", boardRouter);

const server = net.createServer(socket => {
    let socketData = Buffer.alloc(0);

    socket.on("data", (data) => {
        socketData = Buffer.concat([socketData, data]);

        try {
            const req = new Request(socketData.toString());
            const res = new Response(socket, req.headers.connection);

            routeHandler(req, res);

            socketData = Buffer.alloc(0);
            if (socket.writable && res.connection.toLowerCase() != "keep-alive") socket.end();
        } catch { }
    });

    socket.on("error", (_) => socket.end());
});

function routeHandler(req, res) {
    const router = routeStack.find(req.path);
    if (!router) return res.setStatus(404).send();
    if (req.error != null) res.setStatus(400).send(req.error);
    else try {
        router.handler(req, res);
    } catch (e) {
        logger.error(e);
        res.setStatus(500).send();
    }
}

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`,);
});