const UserController = require('../controllers/User.controller');
const AuthMiddleware = require('../middlewares/Auth.middleware');

module.exports.routesConfig = function (app) {
    app.post('/users', [
        UserController.insert
    ]);
    app.get('/users', [
        AuthMiddleware.validJWTNeeded,
        UserController.list
    ]);
    app.get('/users/:userId', [
        AuthMiddleware.validJWTNeeded,
        UserController.getById
    ]);
    app.patch('/users/:userId', [
        AuthMiddleware.validJWTNeeded,
        AuthMiddleware.onlySelfCanDoThisAction,
        UserController.patchById
    ]);
    app.delete('/users/:userId', [
        AuthMiddleware.validJWTNeeded,
        AuthMiddleware.onlySelfCanDoThisAction,
        UserController.removeById
    ]);
    app.get('/self', [
      AuthMiddleware.validJWTNeeded,
      UserController.getSelf
    ]);
};