const express = require("express");
const path = require("path");

const server = express();
const port = 8000;
const startUrl = "http://localhost:";

try{
    server.use("/css", express.static(path.join(__dirname, "../application/css")));
    server.use("/js", express.static(path.join(__dirname, "../application/js")));
    server.use("/images", express.static(path.join(__dirname, "../application/resources/images")));
    server.use("/icons", express.static(path.join(__dirname, "../application/resources/icons")));
    
    server.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../application/html/index.html"));
    })

    server.listen(port, () => {
        console.log("Server pokrenut na: " + startUrl + port);
    })
}
catch(err){
    console.log(err);
}