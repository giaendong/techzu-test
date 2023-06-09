import { createComment, listReply, listParent, findById, patchComment, removeById } from '../models/Comment.model.js';
import { findById as findUserById } from '../models/User.model.js';

export async function insert(req, res) {
  try {
    const result = await createComment({...req.body, author: req.jwt.userId});
    await patchComment(req.body.parentId, {$push: {replies: result._id}})
    res.status(201).send({id: result._id});
  } catch (error) {
    res.status(500).send({ errorCode: 500, message: 'failed: createComment'})
  }
}

export function getReplyList(req, res) {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    const parentId = req.query.parentId;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    listReply(limit, page, parentId)
        .then((result) => {
            res.status(200).send(result);
        })
}

export function getCommentList(req, res) {
  let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
      if (req.query.page) {
          req.query.page = parseInt(req.query.page);
          page = Number.isInteger(req.query.page) ? req.query.page : 0;
      }
  }
  listParent(limit, page)
      .then((result) => {
          res.status(200).send(result);
      })
}

export function getCommentById(req, res) {
    findById(req.params.id)
        .then((result) => {
            res.status(200).send(result);
        });
}

export function patchCommentById(req, res) {
    findById(req.params.id)
        .then((result) => {
          if (result.author.valueOf() === req.jwt.userId) {
            patchComment(req.params.id, req.body)
              .then((result) => {
                res.status(204).send({});
              });
            } else {
              res.status(403).send({});
            }
        });
}

export function removeCommentById(req, res) {
    removeById(req.params.id)
        .then((result)=>{
            res.status(204).send({});
        });
}