import { db1004 } from "../dao/DB1004";

class UserRepository {
    static tableName = "users";

    static async getUser(email) {
        return await db1004.select({
            table: this.tableName,
            column: "*",
            condition: `email="${email}"`
        });
    }

    static async createUser(email, password, name) {
        return await db1004.insert({
            table: this.tableName,
            columns: ["email", "password", "name"],
            values: [email, password, name]
        });
    }
}

export { UserRepository }