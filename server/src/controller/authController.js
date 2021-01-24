const User = require('../model/User');
const { generateJwt } = require('../utils/authorization');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

function login(req, res, next) {

    const { email, password } = req.body;

    User.findOne({ "email": email }, (err, user) => {

        if (err) throw err;

        if (!user || !user.comparePassword(password)) {
            return res.status(401).json({
                "title": "Unauthorized",
                "status": "401",
                "detail": "Bad credentials.",
                "timestamp": Date.now()
            });
        }

        const token = generateJwt(user);

        return res.status(200).json({
            user,
            token
        });
    });
}

async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

async function googleSignIn(req, res, next) {

    const id_token = req.body.id_token;

    let googleUser = await verify(id_token)
        .catch(e => {
            return res.status(403).json({
                "ok": false,
                "err": e
            });
        });

    User.findOne({ "email": googleUser.email }, (err, user) => {

        if (err) throw err;

        if (user) {

            if (user.google === false) {

                return res.status(400).json({
                    "title": "Bad Request",
                    "status": 400,
                    "detail": "You must start session with your normal credentials",
                    "timestamp": Date.now()
                });

            } else {

                const token = generateJwt(user);

                return res.status(200).json({
                    user,
                    token
                });

            }

        } else {

            let newUser = new User();
            newUser.nombre = googleUser.nombre;
            newUser.email = googleUser.email;
            newUser.password = ':)';
            newUser.img = googleUser.img;
            newUser.google = true;

            newUser.save((err, userDB) => {

                if (err) throw err;

                const token = generateJwt(userDB);

                return res.status(200).json({
                    "user": userDB,
                    token
                });

            });

        }

    });

}

module.exports = {
    login,
    googleSignIn
}