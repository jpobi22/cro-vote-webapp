const choicesDAO = require("../dao/choicesDAO.js");

class RESTchoices {

    constructor() {
        this.choicesDAO = new choicesDAO();
    }

    async getChoicesByPost(req, res) {
        const postId = req.query.postId; 
        try {
            const choices = await this.choicesDAO.getChoicesByPost(postId);
            res.status(200).json({ choices });
        } catch (err) {
            console.error("Error fetching choices:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = RESTchoices;
