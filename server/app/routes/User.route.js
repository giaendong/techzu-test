import { insert, getUserList, getUserById, patchUserById, removeUserById, getSelf } from '../controllers/User.controller.js';
import { validJWTNeeded, onlySelfCanDoThisAction } from '../middlewares/Auth.middleware.js';

export function routesConfig (app) {
    app.post('/users', [
        insert
    ]);
    app.get('/users', [
        validJWTNeeded,
        getUserList
    ]);
    app.get('/users/:userId', [
        validJWTNeeded,
        getUserById
    ]);
    app.patch('/users/:userId', [
        validJWTNeeded,
        onlySelfCanDoThisAction,
        patchUserById
    ]);
    app.delete('/users/:userId', [
        validJWTNeeded,
        onlySelfCanDoThisAction,
        removeUserById
    ]);
    app.get('/self', [
      validJWTNeeded,
      getSelf
    ]);
}