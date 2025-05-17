const ChoiceDAO = require("../dao/choicesDAO.js");

class RESTchoices {
    constructor() {
        this.choiceDAO = new ChoiceDAO();
    }

   async getChoicesByPost(req, res) {
    const postName = req.query.postName;
    try {
        const choices = await this.choiceDAO.getChoicesByPost(postName);
        if (choices.length > 0) {
            res.status(200).json({ choices });
        } else {
            res.status(404).json({ error: "Choices not found" });
        }
    } catch (err) {
        console.error("Error in getting choices by post name:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

}

module.exports = RESTchoices;
