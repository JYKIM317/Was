import { Response } from "../dto/Response"

class Router {
    route = {
        "GET": {},
        "POST": {},
        "PUT": {},
        "PATCH": {},
        "DELETE": {},
        "UPDATE": {}
    }
    get(path: string, func: Function) {
        this.route.GET[path] = func;
    }

    requestHandler(req): Response {
        let routePath = req.path;
        while(true) {
            const exist = this.checkRouteExist(req.method, routePath);
            if(routePath === "/" && !exist) throw new Error("No Route");
            if(exist) return this.route[req.method][routePath](req);
            else routePath = this.reducePath(routePath);
        }
    }

    private checkRouteExist(method, path) {
        const callback: Function | null = this.route[method][path];
        return callback != null;
    }
    
    private reducePath(path) {
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        
        const lastSlashIndex = path.lastIndexOf('/');

        if(lastSlashIndex === - 1){
            return '/';
        }
        return path.substring(0, lastSlashIndex + 1);
    }
}

export { Router }