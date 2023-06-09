import { insert, getReplyList, getCommentById, patchCommentById, removeCommentById, getCommentList } from '../controllers/Comment.controller.js';
import { validJWTNeeded } from '../middlewares/Auth.middleware.js';

export function routesConfig (app) {
    app.post('/comment', [
        validJWTNeeded,
        insert
    ]);
    app.get('/comment', [
        validJWTNeeded,
        getCommentList
    ]);
    app.get('/comment/replies', [
      validJWTNeeded,
      getReplyList
  ]);
    app.get('/comment/:id', [
        validJWTNeeded,
        getCommentById
    ]);
    app.patch('/comment/:id', [
        validJWTNeeded,
        patchCommentById
    ]);
    app.delete('/comment/:id', [
        validJWTNeeded,
        removeCommentById
    ]);
}