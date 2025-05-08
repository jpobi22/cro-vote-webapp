const UserDAO = require("../dao/userDAO.js");
const bcrypt = require("bcrypt");

class RESTuser {  

  constructor() {
    this.userDAO = new UserDAO();
  }

  async postUser(req, res) {
    res.type("application/json");
    
    const { oib, name, surname, address, phone, email, password} = req.body;
    const id_user_type = 2;
    const TOTP_enabled = 0;
    const TOTP_secred_key = "Not generated!"

    if (!oib || !name || !surname || !address || !phone || !email || !password) {
        res.status(400).json({ error: "Required data missing!" });
        return;
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    var user = {
        oib,
        name,
        surname,
        address,
        phone,
        email,
        password: hashedPassword,
        id_user_type,
        TOTP_enabled,
        TOTP_secred_key
    }

    const response = await this.userDAO.add(user);
    const type = await this.userDAO.getNameUserType(oib);
    
    if (response) {
      let user = {
        oib,
        type,
        email
      };

      req.session.user = user;

      res.status(201).json({ Success: "User added" });
    } else {
      res.status(400).json({ Error: "Adding cought an error." });
    }
  }  
}

module.exports = RESTuser;
