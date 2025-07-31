const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { SECRET } = require('./env');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger_output.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const user = {
    id: 'user',
    pwd: 'password'
};

function extractBearerToken(header) {
    const matches = header.match(/(bearer)\s+(\S+)/i);
    console.log(matches[2]);
    return matches[2];
}

function checkTokenMiddleware(req, res, next) {
    console.log(req.headers.authorization);
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization);

    if (!token) {
        return res.status(401).json({ Error: 'No access token ! Try Again hahaha ! '});
    }
    jwt.verify(token, SECRET, (err, decodedToken) => {
        if (err)
            return res.status(401).json({ Error: 'Bad token ... '});
        else {
            return next();
        }
    });
};

app.get('/', (req, res) => {
    const token = jwt.sign(user, SECRET, { expiresIn: '1 hours'});
    res.json({ access_token: token });
});

app.post('/admin', checkTokenMiddleware, (req, res) => {
    res.send('Utilisateur identifé !');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});