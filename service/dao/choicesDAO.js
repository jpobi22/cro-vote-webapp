class ChoicesDAO {
    constructor() {
        this.db = new DB();
    }

    async getChoicesByPost(postName) {
        const query = `
            SELECT c.id, c.name
            FROM choices c
            JOIN post p ON p.id = c.post_id
            WHERE p.name = ?
        `;
        return await this.db.executeQuery(query, [postName]);
    }
}

module.exports = ChoicesDAO;
