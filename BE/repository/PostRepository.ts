import { DBManager } from "../database/DBManager";

class PostRepository {
    static TABLE_NAME = "post";

    static getBoard(page) {
        const SELECT_PAGE_OFFSET = page * 10 - 10;

        return DBManager.select({
            table: this.TABLE_NAME,
            column: "*",
            orderBy: "id",
            desc: true,
            limit: 10,
            offset: SELECT_PAGE_OFFSET
        });
    }

    static createPost(postData) {
        return DBManager.insert({
            table: this.TABLE_NAME,
            columns: Object.keys(postData),
            values: Object.values(postData)
        });
    }

    static getPost(postId) {
        return DBManager.select({
            table: this.TABLE_NAME,
            column: "*",
            condition: `id=${postId}`
        });
    }

    static async updatePostViewCount(postId) {
        return await DBManager.update({
            table: this.TABLE_NAME,
            updates: ["view = view + 1"],
            condition: `id = ${postId}`
        });
    }
}

export { PostRepository }