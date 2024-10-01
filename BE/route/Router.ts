import { Response } from "../dto/Response"
import { Url } from "./Url";

class Router extends Url {
    constructor() { super() }
    route = {
        "GET": {},
        "POST": {},
        "PUT": {},
        "PATCH": {},
        "DELETE": {},
        "UPDATE": {}
    }

    get(path: string, func: Function) {
        const pathList = this.separatePath(path);
        const [convertedPath, dynamicPathName] = this.convertToDynamicPathIfExist(pathList);
        this.route.GET[convertedPath] = {
            pathName: dynamicPathName,
            callback: func
        };
    }

    post(path: string, func: Function) {
        const pathList = this.separatePath(path);
        const [convertedPath, dynamicPathName] = this.convertToDynamicPathIfExist(pathList);
        this.route.POST[convertedPath] = {
            pathName: dynamicPathName,
            callback: func
        };
    }

    requestHandler(req): Response {
        const separatedURL = this.separateURL(req.path);
        const [routePath, queryString] = [separatedURL.path, separatedURL.queryString];
        const isStaticRouteExist = this.checkRouteExist(req.method, routePath)
        req.query = this.parseQueryString(queryString);

        if (isStaticRouteExist) {
            return this.route[req.method][routePath].callback(req);
        } else {
            return this.routeDynamicPath(req, routePath);
        }
    }

    private checkRouteExist(method, path) {
        const callback: object | null = this.route[method][path];
        return callback != null;
    }

    private convertToDynamicPathIfExist(pathList): [string, Array<string>] {
        const dynamicPathDelimiter = ":";
        const dynamicPathName: Array<string> = [];
        const transPathList = pathList.map((path) => {
            if (path.startsWith(dynamicPathDelimiter)) {
                const thisPathName = path.replace(dynamicPathDelimiter, "");
                dynamicPathName.push(thisPathName);
                return "([^/]+)";
            } else {
                return path;
            }
        });
        const dynamicPath = "/" + transPathList.join("/");
        return [dynamicPath, dynamicPathName];
    }

    private routeDynamicPath(req, path) {
        const notExist = -1;
        const allRoutes = Object.keys(this.route[req.method]);
        const matchRouteIdx = allRoutes.findIndex((thisRoute) => {
            const checkMatch = path.match(thisRoute) ?? [];
            if (checkMatch[0] === path) {
                const dynamicPathNames = this.route[req.method][thisRoute].pathName;
                const dynamicPathValues = checkMatch.slice(1);
                dynamicPathNames.forEach((key, idx) => {
                    req.params[key] = dynamicPathValues[idx];
                });
                return true;
            }
        });

        if (matchRouteIdx === notExist) {
            return new Response(404, req.headers.Connection);
        } else {
            const matchedRoute = allRoutes[matchRouteIdx]
            return this.route[req.method][matchedRoute].callback(req);
        }
    }
}

export { Router }