import { Response } from "../dto/Response"
interface Route {
    path: string;
    parameters: Array<string>;
}
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
        const pathList = this.separatePath(path);
        const dynamicPath = this.convertToDynamicPath(pathList);
        this.route.GET[dynamicPath] = func;
    }

    post(path: string, func: Function) {
        const pathList = this.separatePath(path);
        const dynamicPath = this.convertToDynamicPath(pathList);
        this.route.POST[dynamicPath] = func;
    }

    requestHandler(req): Response {
        const separatedURL = this.separateURL(req.path);
        const [routePath, queryString] = [separatedURL.path, separatedURL.queryString];
        const pathList = this.separatePath(routePath);
        const caseOfRoute: Array<Route> = this.createCaseOfRoute(pathList);

        for (let idx = 0; idx < caseOfRoute.length; idx++) {
            const exist = this.checkRouteExist(req.method, caseOfRoute[idx].path);
            if (exist) {
                req.params = caseOfRoute[idx].parameters;
                req.query = this.parseQueryString(queryString);
                return this.route[req.method][caseOfRoute[idx].path](req);
            }
        }

        return new Response(404, req.headers.Connection);
    }

    private checkRouteExist(method, path) {
        const callback: Function | null = this.route[method][path];
        return callback != null;
    }

    private separateURL(url) {

        const [prePath, anchor] = url.split("#");
        const [path, queryString] = prePath.split("?");
        return {
            path: path,
            queryString: queryString || null,
            anchor: anchor || null
        };
    }

    private parseQueryString(queryString) {
        if (!queryString)
            return null;
        const result = {};
        const queries = queryString.split("&");
        queries.forEach((query) => {
            const [key, value] = query.split("=");
            result[key] = value;
        });

        return result;
    }

    private separatePath(path): Array<string> {

        const [empty, ...pathList] = path.split("/");
        return pathList;
    }

    private convertToDynamicPath(pathList) {
        const transPathList = pathList.map((path) => path[0] === ":" ? path[0] : path);
        const dynamicPath = "/" + transPathList.join("/");
        return dynamicPath;
    }

    private createCaseOfRoute(pathList: Array<string>): Route[] {
        const caseResult: Route[] = [];

        pathList.forEach((_, index) => {
            const tempPathList = [...pathList];
            let tempParameters: Array<string> = [];
            for (let idx = index; idx >= 0; idx--) {
                tempPathList[idx] = ":";
                tempParameters.push(pathList[idx]);

                const parameters = [...tempParameters];
                const path = "/" + tempPathList.join("/");
                caseResult.push({ path, parameters });
            }
            tempParameters = [];
        });
        caseResult.push({ path: "/" + pathList.join("/"), parameters: [] });

        const sortedCaseResult = this.sortCaseOfRoutes(caseResult);
        return sortedCaseResult;
    }

    private sortCaseOfRoutes(routes: Route[]): Route[] {
        const sortedRoutes = routes.sort((a, b) => {
            const colonACnt = this.countColons(a.path);
            const colonBCnt = this.countColons(b.path);

            return colonACnt - colonBCnt;
        });
        return sortedRoutes;
    }

    private countColons(route) {
        return (route.match(/:/g) || []).length;
    }
}

export { Router }