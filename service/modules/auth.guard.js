const path = require("path");

function isAdmin(req, res, next) {
    const type = req.session?.user?.type;
    if (type !== "Admin") {
        return res.status(403).sendFile(path.join(__dirname, "../../application/html/unauthorized.html"));
    }
    next();
}

module.exports = { isAdmin };
