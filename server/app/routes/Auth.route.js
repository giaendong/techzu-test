import { hasAuthValidFields, isPasswordAndUserMatch } from '../middlewares/User.middleware.js';
import { validJWTNeeded, verifyRefreshBodyField, validRefreshNeeded } from '../middlewares/Auth.middleware.js';
import { login } from '../controllers/Auth.controller.js';

export function routesConfig (app) {

    app.post('/auth', [
        hasAuthValidFields,
        isPasswordAndUserMatch,
        login
    ]);

    app.post('/auth/refresh', [
        validJWTNeeded,
        verifyRefreshBodyField,
        validRefreshNeeded,
        login
    ]);
}