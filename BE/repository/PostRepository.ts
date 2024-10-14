import { DBManager } from "../database/DBManager";

class PostRepository {
    static TABLE_NAME = "post";

    static async getBoard(page) {
        const SELECT_PAGE_OFFSET = page * 10 - 10;

        return await DBManager.select({
            table: this.TABLE_NAME,
            column: "*",
            orderBy: "id",
            desc: true,
            limit: 10,
            offset: SELECT_PAGE_OFFSET
        });
    }

    static async getPost(postId) {

    }
}

export { PostRepository }