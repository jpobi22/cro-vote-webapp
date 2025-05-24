const choicesDAO = require("../dao/choicesDAO.js");

class RESTchoices {

    constructor() {
        this.choicesDAO = new choicesDAO();
    }

    async getChoicesByPost(req, res) {
        const postId = req.query.postId; 
        const choices = await this.choicesDAO.getChoicesByPost(postId);
        res.status(200).json({ choices });
    }
    
    async postNewChoice(req, res) {
        const { name, post_id } = req.body;
    
        if (!name || post_id === undefined || post_id === null) {
            return res.status(400).json({ error: "Missing choice name or post ID" });
        }
        const result = await this.choicesDAO.postNewChoice(name, post_id);
        res.status(201).json({ message: "Choice created successfully", result });
    }
}

module.exports = RESTchoices;
