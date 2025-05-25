const VoteDAO = require("../dao/voteDAO.js");
const crypto = require('crypto');

class RESTvote {
    constructor() {
        this.voteDAO = new VoteDAO();
        this.secret = process.env.SECRET_KEY_HMAC;
    }

    async submitVote(req, res) {
        res.type("application/json");

        try {
            const user = req.session.user;
            if (!user || !user.oib) {
                return res.status(401).json({
                    error: "Unauthorized."
                });
            }

            const {
                choiceId,
                postId
            } = req.body;
            if (!choiceId || !postId) {
                return res.status(400).json({
                    error: "Missing data."
                });
            }

            const alreadyVoted = await this.voteDAO.userAlreadyVoted(user.oib, postId);
            if (alreadyVoted) {
                return res.status(409).json({
                    error: "Already voted."
                });
            }

            const signature = this.generateVoteSignature(user.oib, postId, choiceId);

            await this.voteDAO.insertVote(user.oib, postId, choiceId, signature);
            res.status(200).json({
                success: "Vote recorded."
            });

        } catch (err) {
            console.error("Error in submitVote:", err);
            res.status(500).json({
                error: "Server error."
            });
        }
    }
    async getVotedPostIds(req, res) {
        res.type("application/json");

        try {
            const user = req.session.user;
            if (!user || !user.oib) {
                return res.status(401).json({
                    error: "Unauthorized"
                });
            }

            const result = await this.voteDAO.db.executeQuery(
                "SELECT post_id FROM user_post WHERE user_oib = ?",
                [user.oib]
            );

            const votedPostIds = result.map(row => row.post_id);
            res.status(200).json({
                votedPostIds
            });

        } catch (err) {
            console.error("Error fetching voted post IDs:", err);
            res.status(500).json({
                error: "Server error."
            });
        }
    }
    generateVoteSignature(oib, postId, choiceId) {
        const data = `${oib}:${postId}:${choiceId}`;
        return crypto.createHmac('sha256', this.secret).update(data).digest('hex');
    }

    async verifyVoteSignature(req, res) {
        res.type("application/json");
    
        try {
            const user = req.session.user;
            const { postId } = req.body;
    
            if (!user || !user.oib || !postId) {
                return res.status(400).json({ error: "Missing data." });
            }
    
            const result = await this.voteDAO.verifyVoteSignature(user.oib, postId);
            if (result.length === 0) {
                return res.status(404).json({ error: "No vote found." });
            }
    
            const { choices_id, signature } = result[0];
            const expected = this.generateVoteSignature(user.oib, postId, choices_id);
    
            if (signature !== expected) {
                return res.status(400).json({ error: "Vote integrity compromised." });
            }
    
            return res.status(200).json({ success: "Vote verified." });
    
        } catch (err) {
            console.error("Error verifying vote signature:", err);
            return res.status(500).json({ error: "Server error." });
        }
    }
    
}

module.exports = RESTvote;