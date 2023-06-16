import { upsert } from '../controllers/Review.controller.js';
import { validJWTNeeded } from '../middlewares/Auth.middleware.js';

export function routesConfig (app) {
    app.post('/review', [
        validJWTNeeded,
        upsert
    ]);
}