const PostDAO = require("../dao/postDAO.js");

class RESTpost{

    constructor() {
        this.postDAO = new PostDAO();
    }

    async getPostsPaginated(req, res) {
        res.type("application/json");
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const posts = await this.postDAO.getPostsPaginated(limit, offset);
        const total = await this.postDAO.getPostCount();

        res.status(200).json({
            posts,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    }
}
module.exports = RESTpost;
