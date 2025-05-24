let DB = require("../db/database.js");

class PostDAO {
    constructor() {
        this.db = new DB();
    }
    
    async getPostById(postId) {
    const result = await this.db.executeQuery("SELECT * FROM post WHERE id = ?", [postId]);
    return result[0]; 
    }

    async getPostsPaginated(limit, offset) {
        return await this.db.executeQuery("SELECT * FROM post WHERE isActive = 1 LIMIT ? OFFSET ?", [limit, offset]);
    }
    
    async getPostCount() {
        const result = await this.db.executeQuery("SELECT COUNT(*) as count FROM post WHERE isActive = 1");
        return result[0].count;
    }
    
    async getAllPostsPaginated(limit, offset) {
        return await this.db.executeQuery("SELECT * FROM post LIMIT ? OFFSET ?", [limit, offset]);
    }
    
    async getAllPostCount() {
        const result = await this.db.executeQuery("SELECT COUNT(*) as count FROM post");
        return result[0].count;
    }

    async togglePostIsActive(id) {
        const sql = `UPDATE post SET isActive = CASE WHEN isActive = 1 THEN 0 ELSE 1 END WHERE id = ?`;
        return await this.db.executeQuery(sql, [id]);
    }

    async getVoteStats(id) {
        const sql = `SELECT 
                    c.name AS choiceName, 
                    COUNT(up.choices_id) AS voteCount,
                    (SELECT COUNT(*) FROM user_post WHERE post_id = ?) AS totalVotes
                    FROM 
                        choices c
                    LEFT JOIN 
                        user_post up ON c.id = up.choices_id
                    WHERE 
                        c.post_id = ?
                    GROUP BY 
                        c.id;
                    `;
        return await this.db.executeQuery(sql, [id, id]);
    }

    async postNewPost(name, description) {
        const sql = `INSERT INTO post (name, description, isActive) VALUES (?, ?, 0);`;
        const result = await this.db.executeQuery(sql, [name, description]);
        return result.insertId;
    }    
}

module.exports = PostDAO;
