import { DBManager } from "../database/DBManager";

class UserRepository {
    static TABLE_NAME = "member";

    static async getUser(email) {
        return await DBManager.select({
            table: this.TABLE_NAME,
            column: "*",
            condition: `email="${email}"`
        });
    }

    static async getUserPublicData() {
        return await DBManager.select({
            table: this.TABLE_NAME,
            column: "email, name",
            condition: null
        });
    }

    static async createUser(email, password, name) {
        return await DBManager.insert({
            table: this.TABLE_NAME,
            columns: ["email", "password", "name"],
            values: [email, password, name]
        });
    }
}

export { UserRepository }