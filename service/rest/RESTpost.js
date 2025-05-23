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
        const post = await this.postDAO.getPostById(postId);
        if (post) {
            res.status(200).json(post);
        } 
        else {
            res.status(404).json({ error: "Post not found" });
        }
    }

    async getAllPostsPaginated(req, res) {
        res.type("application/json");
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const posts = await this.postDAO.getAllPostsPaginated(limit, offset);
        const total = await this.postDAO.getAllPostCount();

        res.status(200).json({
            posts,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    }

    async toggleIsActive(req, res) {
        const postId = req.params.postId;
    
        if (!postId || isNaN(postId)) {
            return res.status(400).json({ error: "Invalid post ID" });
        }
    
        await this.postDAO.togglePostIsActive(postId);
        res.status(200).json({ message: "Post activation status toggled successfully." });
    }
    
    async getVoteStats(req, res) {

        const postId = parseInt(req.query.postId, 10);
        console.log("Fetching stats for postId:", postId);

        if (isNaN(postId)) {
            return res.status(400).json({ error: "Invalid postId" });
        }
        const result = await this.postDAO.getVoteStats(postId);
        res.status(200).json({ stats: result });
    }

}

module.exports = RESTpost;
