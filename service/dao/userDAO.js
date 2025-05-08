let DB = require("../db/database.js");
const bcrypt = require("bcrypt");

class UserDAO {
    constructor() {
        this.db = new DB();
    }

    async getUser(oib) {
        return await this.db.executeQuery("SELECT * FROM user WHERE oib = ?", [oib]);
    }

    async oibExists(oib) {
        return await this.db.executeQuery("SELECT * FROM user WHERE oib = ?", [oib]);
    }

    async getNameUserType(oib) {
        return await this.db.executeQuery(
            "SELECT ut.name FROM user_type ut, user u WHERE u.oib = ? AND u.id_user_type = ut.id",
            [oib]
        );
    }

    async add(user) {
        const sql = "INSERT INTO user VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return await this.db.executeQuery(sql, [
            user.oib,
            user.id_user_type,
            user.name,
            user.surname,
            user.address,
            user.phone,
            user.email,
            user.TOTP_enabled,
            user.TOTP_secred_key,
            user.password
        ]);
    }

    async update(oib, element, elementValue) {
        const allowedColumns = [
            'id_user_type', 'name', 'surname', 'address', 'phone',
            'email', 'TOTP_enabled', 'TOTP_secret_key', 'password'
        ];

        if (!allowedColumns.includes(element)) {
            throw new Error('Invalid column name');
        }

        const sql = `UPDATE user SET ${element} = ? WHERE oib = ?`;
        return await this.db.executeQuery(sql, [elementValue, oib]);
    }

    async delete(oib) {
        return await this.db.executeQuery("DELETE FROM user WHERE oib = ?", [oib]);
    }

    async login(oib, password) {
        const result = await this.db.executeQuery("SELECT * FROM user WHERE oib = ?", [oib]);
        
        if (result.length === 0) {
            return null;
        }
    
        const user = result[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        return passwordMatch ? user : null;
    }
}

module.exports = UserDAO;
