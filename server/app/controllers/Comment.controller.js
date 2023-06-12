import { createComment, listReply, listParent, findById, patchComment, removeById, countComment } from '../models/Comment.model.js';

export async function insert(req, res) {
  try {
    const result = await createComment({...req.body, author: req.jwt.userId});
    if (req.body.parentId && result._id) {
      await patchComment(req.body.parentId, {$addToSet: {replies: result._id}});
    }
    res.status(201).send({id: result._id});
    global.io.emit('comments', {id: result._id, type: 'insert', userId: req.jwt.userId, isNotReply: req.body.parentId ? false : true});
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

export async function getCommentList(req, res) {
  let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 1;
  if (req.query) {
      if (req.query.page) {
          req.query.page = parseInt(req.query.page);
          page = Number.isInteger(req.query.page) ? req.query.page : 1;
      }
  }
  try {
    const comments = await listParent(limit, page);
    const count = await countComment();
    res.status(200).send({
      comments,
      metadata: {count, pageNumber: page, pageSize: limit}
    });
  } catch (err) {
    res.status(500).send({ errorCode: 500, message: 'failed: getCommentList'})
  }
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
            global.io.emit('comments', {id: req.params.id, type: 'delete', userId: req.jwt.userId});
        });
}