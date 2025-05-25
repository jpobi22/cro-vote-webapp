let DB = require("../db/database.js");

class VoteDAO {
    constructor() {
        this.db = new DB();
    }

    async userAlreadyVoted(oib, postId) {
        const result = await this.db.executeQuery(
            "SELECT COUNT(*) as count FROM user_post WHERE user_oib = ? AND post_id = ?",
            [oib, postId]
        );
        return result[0].count > 0;
    }

   async insertVote(oib, postId, choiceId, signature) {
    return await this.db.executeQuery(
        "INSERT INTO user_post (user_oib, post_id, choices_id, voted_time, signature) VALUES (?, ?, ?, NOW(), ?)",
        [oib, postId, choiceId, signature]
    );
    
    }
    async verifyVoteSignature(oib, postId) {
        return await this.db.executeQuery(
            "SELECT choices_id, signature FROM user_post WHERE user_oib = ? AND post_id = ?",
            [oib, postId]
        );
    }

}

module.exports = VoteDAO;
