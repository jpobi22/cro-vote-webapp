let DB = require("../db/database.js");
    
class UserDAO{
    constructor(){
        this.db = new DB();
    }

    async getUser(oib){
        this.db.openConnection();
        let result = await this.db.executeQuery("SELECT * FROM user WHERE oib = ?", [oib]);
        this.db.closeConnection();
        return result;
    }

    async getNameUserType(oib){
        this.db.openConnection();
        let result = await this.db.executeQuery("SELECT ut.name FROM user_type ut, user u WHERE u.oib = ? AND u.id_user_type = ut.id", [oib]);
        this.db.closeConnection();
        return result;
    }

    async add(user){
        let sql = "INSERT INTO user VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let result = await this.db.executeQuery(sql, [user.oib, user.id_user_type, user.name, user.surname, user.address, user.phone, user.email, user.TOTP_enabled, user.TOTP_secred_key, user.password]);
        return result;
    }
    
    async update(oib, element, elementValue){
        const allowedColumns = ['id_user_type', 'name','surname', 'address', 'phone','email', 'TOTP_enabled', 'TOTP_secret_key','password'];
        
        if (!allowedColumns.includes(element)) {
            throw new Error('Invalid column name');
        }
    
        let sql = `UPDATE user SET ${element} = ? WHERE oib = ?`;
        let result = await this.db.executeQuery(sql, [elementValue, oib]);
        return result;
    }    

    async delete(oib){
        let sql = "DELETE FROM user WHERE oib = ?";
        let result = await this.db.executeQuery(sql, [oib]);
        return result;
    }

    async login(oib, password){
        let sql = "SELECT * FROM user WHERE oib = ?";
        let result = await this.db.executeQuery(sql, [oib]);
        if(result[0].password==password){
            return result[0];
        }
        else{
            return null;
        }
    }
    
};

module.exports = UserDAO;