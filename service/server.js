const express = require("express");
const session=require('express-session');
const path = require("path");
const cors = require("cors");
const RESTuser = require("./rest/RESTuser.js");


const server = express();
const port = 8000;
const startUrl = "http://localhost:";

try{
    server.use(cors());
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    
    server.use(session(
    { 
        name:'SessionCookie',
        secret: 'e20ed240083408e2d7019f461ee205f28814fbfab11d1d3196',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, expires: new Date(Date.now() + 3600000) }
    }));

    const restUser = new RESTuser();
        
    server.use("/css", express.static(path.join(__dirname, "../application/css")));
    server.use("/js", express.static(path.join(__dirname, "../application/js")));
    server.use("/images", express.static(path.join(__dirname, "../application/resources/images")));
    server.use("/icons", express.static(path.join(__dirname, "../application/resources/icons")));

    server.get("/login", (req, res) => {
        res.sendFile(path.join(__dirname, "../application/html/login.html"));        
    });
    
    server.get("/register", (req, res) => {
        res.sendFile(path.join(__dirname, "../application/html/register.html"));
    });

    server.post("/api/register", restUser.postUser.bind(restUser));
    
    server.get("/change-password", (req, res) => {
        res.sendFile(path.join(__dirname, "../application/html/changePassword.html"));
    })

    server.get("/about-us", (req, res) => {
        res.sendFile(path.join(__dirname, "../application/html/aboutUs.html"));
    })

    server.get("/privacy-policy", (req, res) => {
        res.sendFile(path.join(__dirname, "../application/html/privacyPolicy.html"));
    })

    server.all(/(.*)/, (req, res, next) => {
        if (req.session.user == null) {
            return res.redirect("/login");
        } else {
            next();
        }
    });

    server.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../application/html/index.html"));
    })

    server.get("/voting", (req, res) => {
        res.sendFile(path.join(__dirname, "../application/html/voting.html"));
    })

    server.listen(port, () => {
        console.log("Server pokrenut na: " + startUrl + port);
    })
}
catch(err){
    console.log(err);
}