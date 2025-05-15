let DB = require("../db/database.js");

class PostDAO {
    constructor() {
        this.db = new DB();
    }

    async getPostsPaginated(limit, offset) {
        return await this.db.executeQuery("SELECT * FROM post WHERE isActive = 1 LIMIT ? OFFSET ?", [limit, offset]);
    }
    
    async getPostCount() {
        const result = await this.db.executeQuery("SELECT COUNT(*) as count FROM post WHERE isActive = 1");
        return result[0].count;
    }
    
}

module.exports = PostDAO;
