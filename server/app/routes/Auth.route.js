const UserMiddleware = require('../middlewares/User.middleware');
const AuthMiddleware = require('../middlewares/Auth.middleware');
const AuthController = require('../controllers/Auth.controller');

module.exports.routesConfig = function (app) {

    app.post('/auth', [
        UserMiddleware.hasAuthValidFields,
        UserMiddleware.isPasswordAndUserMatch,
        AuthController.login
    ]);

    app.post('/auth/refresh', [
        AuthMiddleware.validJWTNeeded,
        AuthMiddleware.verifyRefreshBodyField,
        AuthMiddleware.validRefreshNeeded,
        AuthController.login
    ]);
};