import { createReview, isExist, patchReview } from '../models/Review.model.js';

export async function upsert(req, res) {
  try {
    const result = await isExist(req.jwt.userId, req.body.commentId);
    if (result) {
      await patchReview(result._id, {like: req.body.like});
    } else {
      await createReview({comment: req.body.commentId, author: req.jwt.userId, like: req.body.like})
    }
    res.status(201).send({ok: true});
  } catch (error) {
    res.status(500).send({ errorCode: 500, message: 'failed: createReview'})
  }
}