import { createComment, listReply, listParent, findById, patchComment, removeById, countComment, countReplies } from '../models/Comment.model.js';

export async function insert(req, res) {
  try {
    const result = await createComment({...req.body, author: req.jwt.userId});
    if (req.body.parentId && result._id) {
      await patchComment(req.body.parentId, {$addToSet: {replies: result._id}});
    }
    res.status(201).send({id: result._id});
    global.io.emit('comments', {id: result._id, type: 'insert', userId: req.jwt.userId, replyTo: req.body.parentId});
  } catch (error) {
    console.log(error)
    res.status(500).send({ errorCode: 500, message: 'failed: createComment'})
  }
}

export async function getReplyList(req, res) {
    const parentId = req.query.parentId;
    try {
      const replies = await listReply(parentId, req.jwt.userId);
      const count = await countReplies(parentId);
      const comment = await findById(parentId);
      res.status(200).send({
        comment,
        replies,
        metadata: {count, pageNumber: 1, pageSize: count}
      });
    } catch (err) {
      console.log(err)
      res.status(500).send({ errorCode: 500, message: 'failed: getCommentList'})
    }
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
    const comments = await listParent(limit, page, req.jwt.userId);
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