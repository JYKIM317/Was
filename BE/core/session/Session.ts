class Session {
    private storage = {};

    set(sid, data) {
        this.storage[sid] = data;
    }

    get(sid) {
        return this.storage[sid];
    }

    isExist(sid) {
        return this.storage[sid] != null;
    }
}

const session = new Session();

export { session }