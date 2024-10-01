class Url {
    separateURL(url) {
        const [prePath, anchor] = url.split("#");
        const [path, queryString] = prePath.split("?");
        return {
            path: path,
            queryString: queryString || null,
            anchor: anchor || null
        };
    }

    separatePath(path): Array<string> {
        const [empty, ...pathList] = path.split("/");
        return pathList;
    }

    parseQueryString(queryString) {
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
}

export { Url }