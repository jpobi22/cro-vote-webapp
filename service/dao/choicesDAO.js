let DB = require("../db/database.js");

class choicesDAO {
    constructor() {
        this.db = new DB();
    }

    async getChoicesByPost(postId) {
        return await this.db.executeQuery("SELECT * FROM choices WHERE post_id = ?", [postId]);
    }
}

module.exports = choicesDAO;
