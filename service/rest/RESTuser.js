const UserDAO = require("../dao/userDAO.js");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

class RESTuser {  

  constructor() {
    this.userDAO = new UserDAO();
  }

  async postUser(req, res) {
    res.type("application/json");
    
    const { oib, name, surname, address, phone, email, password} = req.body;
    const id_user_type = 2;
    const TOTP_enabled = 0;
    const TOTP_secret_key = "Not generated!"

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
        TOTP_secret_key
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

  async getTotpStatus(req, res) {
    res.type("application/json");

    const oib = req.params.oib;
    try {
      const result = await this.userDAO.totpEnabled(oib);
      res.status(200).json({ TOTP_enabled: result[0].TOTP_enabled });
    } catch (err) {
      console.error("Error getting TOTP status:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async enableTotp(req, res) {
    res.type("application/json");

    const oib = req.params.oib;
    try {
      const secretResult = await this.userDAO.getTotpSecretKey(oib);
      let secret = secretResult[0].TOTP_secret_key;

      if (secret === "Not generated!") {
        const newSecret = speakeasy.generateSecret({ length: 20 });
        secret = newSecret.base32;
        await this.userDAO.setSecretKey(oib, secret);
      }

      await this.userDAO.setTotp(oib, 1);

      const otpauth_url = speakeasy.otpauthURL({
        secret: secret,
        label: `CroVote:${oib}`,
        issuer: "CroVote",
        encoding: "base32"
      });

      qrcode.toDataURL(otpauth_url, (err, data_url) => {
        if (err) {
          console.error("QR code generation error:", err);
          res.status(500).json({ error: "QR code generation failed" });
        } else {
          res.status(200).json({ secret, qrCode: data_url });
        }
      });

    } catch (err) {
      console.error("Error enabling TOTP:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async disableTotp(req, res) {
    res.type("application/json");

    const oib = req.params.oib;

    try {
      await this.userDAO.setTotp(oib, 0);
      res.status(200).json({ success: "TOTP disabled." });
    } catch (err) {
      console.error("Error disabling TOTP:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async login(req, res) {
    res.type("application/json");
  
    const { oib, password, recaptchaToken } = req.body;    
  
    if (!oib || !password) {
      res.status(400).json({ error: "Required data missing!" });
      return;
    }

    const isCaptchaValid = await this.verifyRecaptcha(recaptchaToken);
    if (!isCaptchaValid) {
      return res.status(400).json({ error: 'Bad recaptcha response!' });
    }
  
    try {
      const user = await this.userDAO.login(oib, password);
  
      if (!user) {
        res.status(401).json({ error: "Invalid OIB or password!" });
        return;
      }
  
      const type = await this.userDAO.getNameUserType(oib);
  
      if (user.TOTP_enabled) {
        res.status(200).json({ requiresTOTP: true });
      } else {
        req.session.user = {
          oib: user.oib,
          type: type[0]?.name || "Unknown",
          email: user.email
        };
        res.status(200).json({ success: "Login successful!" });
      }
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async verifyTotp(req, res) {
    res.type("application/json");
  
    const { oib, token } = req.body;
  
    if (!oib || !token) {
      res.status(400).json({ error: "Require data is missing!" });
      return;
    }
  
    try {
      const user = await this.userDAO.getUser(oib);
      const type = await this.userDAO.getNameUserType(oib);
      const secretResult = await this.userDAO.getTotpSecretKey(oib);
      const secret = secretResult[0].TOTP_secret_key;
  
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: "base32",
        token: token,
        window: 1
      });
  
      if (verified) {
        req.session.user = {
          oib: user[0]?.oib,
          type: type[0]?.name || "Unknown",
          email: user[0]?.email
        };
        res.status(200).json({ success: "TOTP code is valid." });
      } else {
        res.status(400).json({ error: "TOTP code is invalid." });
      }
    } catch (err) {
      console.error("Error checking TOTP:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  }
  
  async verifyRecaptcha(token) {
    const secretKey = '6LfW5DUrAAAAAMxNL8u5UVaZ5jNlArl0RKUAuiE0';

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: new URLSearchParams({
            secret: secretKey,
            response: token
        })
    });
    const data = await response.json();    
    
    return data.success && data.score > 0.5;
  }
    
}

module.exports = RESTuser;
