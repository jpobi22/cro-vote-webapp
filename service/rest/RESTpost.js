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
    async getPostByName(req, res) {
        const postName = req.query.name;  // Preuzimamo naziv posta iz query parametra

        if (!postName) {
            return res.status(400).json({ error: "Post name is required" });
        }

        try {
            // Dohvaćamo post iz baze prema nazivu
            const post = await this.postDAO.getPostByName(postName);

            if (!post || post.length === 0) {
                return res.status(404).json({ error: "Post not found" });
            }

            res.status(200).json(post[0]);  // Vraćamo prvi post (ako postoji)
        } catch (error) {
            console.error("Error fetching post by name:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
module.exports = RESTpost;
