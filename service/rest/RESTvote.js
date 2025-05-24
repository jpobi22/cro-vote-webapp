const VoteDAO = require("../dao/voteDAO.js");

class RESTvote {
    constructor() {
        this.voteDAO = new VoteDAO();
    }

    async submitVote(req, res) {
        res.type("application/json");

        try {
            const user = req.session.user;
            if (!user || !user.oib) {
                return res.status(401).json({ error: "Unauthorized." });
            }

            const { choiceId, postId } = req.body;
            if (!choiceId || !postId) {
                return res.status(400).json({ error: "Missing data." });
            }

            const alreadyVoted = await this.voteDAO.userAlreadyVoted(user.oib, postId);
            if (alreadyVoted) {
                return res.status(409).json({ error: "Already voted." });
            }

            await this.voteDAO.insertVote(user.oib, postId, choiceId);
            res.status(200).json({ success: "Vote recorded." });

        } catch (err) {
            console.error("Error in submitVote:", err);
            res.status(500).json({ error: "Server error." });
        }
    }
    async getVotedPostIds(req, res) {
    res.type("application/json");

    try {
        const user = req.session.user;
        if (!user || !user.oib) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const result = await this.voteDAO.db.executeQuery(
            "SELECT post_id FROM user_post WHERE user_oib = ?",
            [user.oib]
        );

        const votedPostIds = result.map(row => row.post_id);
        res.status(200).json({ votedPostIds });

    } catch (err) {
        console.error("Error fetching voted post IDs:", err);
        res.status(500).json({ error: "Server error." });
    }
}

}

module.exports = RESTvote;
