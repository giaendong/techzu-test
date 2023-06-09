import { verify } from 'jsonwebtoken';
import { createHmac } from 'crypto';
import dotenv from 'dotenv'
dotenv.config()
const { JWT_KEY } = process.env;

export function verifyRefreshBodyField(req, res, next) {
    if (req.body && req.body.refresh_token) {
        return next();
    } else {
        return res.status(400).send({error: 'need to pass refresh_token field'});
    }
}

export function validRefreshNeeded(req, res, next) {
    let b = Buffer.from(req.body.refresh_token, 'base64');
    let refresh_token = b.toString();
    let hash = createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + JWT_KEY).digest("base64");
    if (hash === refresh_token) {
        req.body = req.jwt;
        return next();
    } else {
        return res.status(400).send({error: 'Invalid refresh token'});
    }
}


export function validJWTNeeded(req, res, next) {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                req.jwt = verify(authorization[1], JWT_KEY);
                return next();
            }

        } catch (err) {
            return res.status(403).send();
        }
    } else {
        return res.status(401).send();
    }
}

export function onlySelfCanDoThisAction(req, res, next) {
  let userId = req.jwt.userId;
  if (req.params && req.params.userId && userId === req.params.userId) {
    return next();
  } else {
    return res.status(403).send();
  }

}