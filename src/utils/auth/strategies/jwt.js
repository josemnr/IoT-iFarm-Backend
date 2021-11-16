const boom = require('@hapi/boom');
const passport = require('passport');
const { config } = require('../../../../config');
const { Strategy, ExtractJwt } = require('passport-jwt');
const UserController = require('./../../../controllers/user');

passport.use(new Strategy({
    secretOrKey: config.authJwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async function(tokenPayload, cb) {
    const userController = new UserController();
    try {
        const user = await userController.getUserByEmail({ email: tokenPayload.email });
        if (!user) {
            return cb(boom.unauthorized(), false);
        }
        delete user.password;
        cb(null, { ...user, scopes: tokenPayload.scopes });
    } catch (error) {
        return cb(error);
    }
}));