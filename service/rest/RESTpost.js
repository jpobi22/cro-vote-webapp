const PostDAO = require("../dao/postDAO.js");

class RESTpost {

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

   async getPostById(req, res) {
    const postId = req.params.postId;
    try {
        const post = await this.postDAO.getPostById(postId);
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: "Post not found" });
        }
    } catch (err) {
        console.error("Error in getPostById:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

}

module.exports = RESTpost;
