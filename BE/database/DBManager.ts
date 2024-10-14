import mysql from "mysql2/promise";
import dotenv from "dotenv";

type SelectOption = {
    table: string
    column: string
    condition?: string
    orderBy?: string
    desc?: boolean
    limit?: number
    offset?: number
}

class DatabaseManager {
    connectionPool: mysql.Pool;
    constructor() {
        dotenv.config();
        this.connectionPool = mysql.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT!),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    private async executeQuery(query, values?) {
        const connection = await this.connectionPool.getConnection();
        const result = connection.query(query, values);
        connection.release();
        return result;
    }

    async select(data: SelectOption) {
        const where = data.condition == null ? "" : ` WHERE ${data.condition}`;
        const orderBy = data.orderBy == null ? "" : ` ORDER BY ${data.orderBy}`;
        const desc = data.desc == null ? "" : ` DESC`;
        const limit = data.limit == null ? "" : ` LIMIT ${data.limit}`;
        const offset = data.offset == null ? "" : ` OFFSET ${data.offset}`;

        const query = `SELECT ${data.column} FROM ${data.table}${where}${orderBy}${desc}${limit}${offset};`;
        return await this.executeQuery(query);
    }

    async insert({ table, columns, values }) {
        const insertColumns = columns.join(", ");
        const valuePlaceholders = columns.map(() => "?").join(", ");
        const query = `INSERT INTO ${table} (${insertColumns}) VALUES (${valuePlaceholders});`;
        return await this.executeQuery(query, values);
    }

    async update({ table, updates, condition = null }) {
        const updateData = updates.join(", ");
        const where = condition == null ? "" : ` WHERE ${condition}`;
        const query = `UPDATE ${table} SET ${updateData}${where};`;
        return await this.executeQuery(query);
    }

    async delete({ table, condition }) {
        const query = `DELETE FROM ${table} WHERE ${condition};`;
        return await this.executeQuery(query);
    }
}


const DBManager = new DatabaseManager();

export { DBManager }