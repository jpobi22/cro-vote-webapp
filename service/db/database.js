const mysql2 = require('mysql2');

class DB {
    constructor() {
        this.pool = mysql2.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'cro_voting',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        }).promise();
    }

    async executeQuery(sql, data) {
        try {
            const [rows] = await this.pool.query(sql, data);
            return rows;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = DB;
