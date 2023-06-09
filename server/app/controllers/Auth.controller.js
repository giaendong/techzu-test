import jwt from 'jsonwebtoken';
import { randomBytes, createHmac } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
const { JWT_KEY } = process.env;

export function login(req, res) {
    try {
        let refreshId = req.body.userId + JWT_KEY;
        let salt = randomBytes(16).toString('base64');
        let hash = createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, JWT_KEY);
        let b = Buffer.from(hash);
        let refresh_token = b.toString('base64');
        res.status(201).send({accessToken: token, refreshToken: refresh_token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
}

export function refresh_token(req, res) {
    try {
        req.body = req.jwt;
        let token = jwt.sign(req.body, JWT_KEY);
        res.status(201).send({id: token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
}