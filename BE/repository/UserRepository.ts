import { DBManager } from "../database/DBManager";

class UserRepository {
    static tableName = "member";

    static async getUser(email) {
        return await DBManager.select({
            table: this.tableName,
            column: "*",
            condition: `email="${email}"`
        });
    }

    static async getUserPublicData() {
        return await DBManager.select({
            table: this.tableName,
            column: "email, name",
            condition: null
        });
    }

    static async createUser(email, password, name) {
        return await DBManager.insert({
            table: this.tableName,
            columns: ["email", "password", "name"],
            values: [email, password, name]
        });
    }
}

export { UserRepository }