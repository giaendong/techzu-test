import { createUser, list, findById, patchUser, removeById } from '../models/User.model.js';
import { randomBytes, createHmac } from 'crypto';

export function insert(req, res) {
    let salt = randomBytes(16).toString('base64');
    let hash = createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = 1;
    createUser(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
}

export function getUserList(req, res) {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
}

export function getUserById(req, res) {
    findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
}

export function getSelf(req, res) {
  findById(req.jwt.userId)
      .then((result) => {
          res.status(200).send(result);
      });
}

export function patchUserById(req, res) {
    if (req.body.password) {
        let salt = randomBytes(16).toString('base64');
        let hash = createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

}

export function removeUserById(req, res) {
    removeById(req.params.userId)
        .then((result)=>{
            res.status(204).send({});
        });
}