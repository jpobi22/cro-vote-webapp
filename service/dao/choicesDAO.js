let DB = require("../db/database.js");

class choicesDAO {
    constructor() {
        this.db = new DB();
    }

    async getChoicesByPost(postId) {
        return await this.db.executeQuery(` SELECT c.* FROM choices c JOIN post p ON c.post_id = p.id WHERE c.post_id = ? AND p.isDeleted IS NULL`, [postId]);
    }
    
    async postNewChoice(name, post_id) {
        const sql = `INSERT INTO choices (name, post_id) VALUES (?, ?);`;
        return await this.db.executeQuery(sql, [name, post_id]);
    }
}

module.exports = choicesDAO;
