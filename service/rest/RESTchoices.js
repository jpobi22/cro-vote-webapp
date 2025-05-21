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
}

module.exports = RESTchoices;
