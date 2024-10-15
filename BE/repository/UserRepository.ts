import { DBManager } from "../database/DBManager";

class UserRepository {
    static TABLE_NAME = "member";

    static getUser(email) {
        return DBManager.select({
            table: this.TABLE_NAME,
            column: "*",
            condition: `email="${email}"`
        });
    }

    static getUserPublicData() {
        return DBManager.select({
            table: this.TABLE_NAME,
            column: "email, name",
        });
    }

    static createUser(email, password, name) {
        return DBManager.insert({
            table: this.TABLE_NAME,
            columns: ["email", "password", "name"],
            values: [email, password, name]
        });
    }
}

export { UserRepository }