const bcrypt = require('bcryptjs');
const boom = require('@hapi/boom');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const UserController = require('./../../../controllers/user');

passport.use(new BasicStrategy(async function(email, password, cb) {
    const userController = new UserController();
    try {
        const user = await userController.getUserByEmail({ email });
        if(!user) {
            return cb(boom.unauthorized(), false);
        }
        if(!(await bcrypt.compare(password, user.password))) {
            return cb(boom.unauthorized(), false);
        }
        delete user.password;
        return cb(null, user);
    } catch (error) {
        return cb(error);
    }
}));