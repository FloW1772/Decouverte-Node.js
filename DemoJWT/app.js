const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { SECRET } = require("./env");

const user = {
    id : 'user',
    pwd : 'password'
};

function checkTokenMiddleware(req, res, next) {
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization);

    if (!token) {
        return res.status(401).json({ error: "Token manquant" });
    }
    jwt.verify(token, SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: "Token invalide" });
        else {
            return next();
        
    }
    });
};


app.get("/", (req, res) => {
    const token = jwt.sign(user, SECRET, { expiresIn: '1 hours' });
    res.json({ token });

});

app.get("/admin", (req, res) => {
    res.send('Utilisateur identifié');

});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});