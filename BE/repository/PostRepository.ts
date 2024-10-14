import { DBManager } from "../database/DBManager";

class PostRepository {
    static TABLE_NAME = "post";

    static async getBoard(page) {
        const SELECT_PAGE = page * 10 - 10;

        return await DBManager.select({
            table: this.TABLE_NAME,
            column: "*",
            orderBy: "id",
            desc: true,
            limit: 10,
            offset: SELECT_PAGE
        });
    }

    static async getPost(postId) {

    }
}

export { PostRepository }