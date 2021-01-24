const jwt = require('jsonwebtoken');
require('../config');

function generateJwt(payload) {
    return jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: 3600 });
}

function verifyToken(req, res, next) {
    const authorization = String(req.get('Authorization'));
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                "title": "Unauthorized",
                "status": 401,
                "detail": 'You must provide a valid token',
                "timestamp": Date.now()
            });
        }
        req.user = decoded['payload'];
        next();
    });
}

const allowedRoles = ['ROLE_ADMIN'];

function verifyRole(req, res, next) {
    const role = req.user.role;
    if (!hasAnyRole(role)) {
        return res.status(404).json({
            "title": "Unauthorized",
            "status": 401,
            "detail": 'Allowed roles : ' + allowedRoles.join(' or '),
            "timestamp": Date.now()
        });
    }
    next();
}

function hasAnyRole(role) {
    return allowedRoles.includes(role);
}

function verifyTokenImg(req, res, next){

    let token = req.query["token"];

    token = token.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        
        if (err) {
            return res.status(401).json({
                "title": "Unauthorized",
                "status": 401,
                "detail": 'You must provide a valid token',
                "timestamp": Date.now()
            });
        }

        next();
    });

}

module.exports = {
    generateJwt,
    verifyToken,
    verifyRole,
    verifyTokenImg
}
