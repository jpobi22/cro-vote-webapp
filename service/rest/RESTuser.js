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
      res.status(201).json({ Success: "User added" });
    } else {
      res.status(400).json({ Error: "Adding cought an error." });
    }
  }

  async oibExists(req, res) {
    res.type("application/json");

    const { oib } = req.body || {};

    if (!oib) {
        res.status(400).json({ error: "Required data missing!" });
        return;
    }

    try {
        const result = await this.userDAO.oibExists(oib);        

        if (result && result.length > 0) {
            res.status(400).json({ error: "Existing oib!" });
        } else {
            res.status(200).json({ success: "OIB not found." });
        }
    } catch (error) {
        console.error("Error in oibExists:", error);
        res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCurrentUser(req, res) {
    res.type("application/json");

    try {
      
        const result = await this.userDAO.getUser(req.session.user.oib);     
        const resultType = await this.userDAO.getNameUserType(req.session.user.oib);

        if (result && resultType) {
          const response = {
            oib: result[0].oib,
            email: result[0].email,
            name: result[0].name,
            surname: result[0].surname,
            type: resultType[0].name
          }

          res.status(201).json(response);
        } else {
          res.status(400).json({ Error: "Error getting current user!" });
        }
    } catch (error) {
        console.error("Error in oibExists:", error);
        res.status(500).json({ error: "Internal server error" });
    }
  }

  async login(req, res) {
    res.type("application/json");
  
    const { oib, password } = req.body;
  
    if (!oib || !password) {
      res.status(400).json({ error: "Required data missing!" });
      return;
    }
  
    try {
      const user = await this.userDAO.login(oib, password);
  
      if (!user) {
        res.status(401).json({ error: "Invalid OIB or password!" });
        return;
      }
  
      const type = await this.userDAO.getNameUserType(oib);
  
      req.session.user = {
        oib: user.oib,
        type: type[0]?.name || "Unknown",
        email: user.email
      };
  
      res.status(200).json({ success: "Login successful!" });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }  
}

module.exports = RESTuser;
