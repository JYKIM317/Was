import mysql from "mysql2/promise";
import dotenv from "dotenv";


class DB1004 {
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

    async #query(query, values = null) {
        const connection = await this.connectionPool.getConnection();
        const result = connection.query(query, values);
        connection.release();
        return result;
    }

    async select({ table, column, condition = null }) {
        const where = condition == null ? "" : ` WHERE ${condition}`;
        const query = `SELECT ${column} FROM ${table}${where};`;
        return await this.#query(query);
    }

    async insert({ table, columns, values }) {
        const insertColumns = columns.join(", ");
        const valuePlaceholders = columns.map(() => "?").join(", ");
        const query = `INSERT INTO ${table} (${insertColumns}) VALUES (${valuePlaceholders});`;
        return await this.#query(query, values);
    }

    async update({ table, updates, condition = null }) {
        const updateData = updates.join(", ");
        const where = condition == null ? "" : ` WHERE ${condition}`;
        const query = `UPDATE ${table} SET ${updateData}${where};`;
        return await this.#query(query);
    }

    async delete({ table, condition }) {
        const query = `DELETE FROM ${table} WHERE ${condition};`;
        return await this.#query(query);
    }
}


const db1004 = new DB1004();

export { db1004 }