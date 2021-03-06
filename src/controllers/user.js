const userModel = require("../models/user");
const bcrypt = require('bcryptjs');

class UserController {
    // Google Oauth Login o sign up  
    async getOrCreateUser(user) {
        const queriedUser = await this.getUsers({ "email": user.email });

        if (queriedUser.length != 0) {
            return queriedUser;
        }
        const temp = await this.createGoogleUser(user);
        return await this.getUsers({ "email": user.email });

    };

    async createUser({ user }) {
        const { password } = user;
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.profile_pic = "https://firebasestorage.googleapis.com/v0/b/ifarm-7f0ea.appspot.com/o/profilePics%2Fgeneric.jpg?alt=media&token=f693f22a-d6d1-4897-a0ee-46d758dc054f"
        if (!user.google_id) {
            user.google_id = "";
        }
        if (!user.greenhouses_id) {
            user.greenhouses_id = []
        }
        const createdUserId = await userModel.create(user);
        return createdUserId;
    }

    async createGoogleUser(user) {
        if (user.password) {
            const { password } = user;
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        if (!user.profile_pic) {
            user.profile_pic = "https://firebasestorage.googleapis.com/v0/b/ifarm-7f0ea.appspot.com/o/profilePics%2Fgeneric.jpg?alt=media&token=f693f22a-d6d1-4897-a0ee-46d758dc054f"
        }

        if (!user.google_id) {
            user.google_id = "";
        }
        if (!user.greenhouses_id) {
            user.greenhouses_id = []
        }
        const createdUserId = await userModel.create(user);
        return createdUserId;
    };

    async getUsers(filters) {
        const users = await userModel.getAll(filters);
        return users || [];
    };

    async getUser({ userId }) {
        const user = await userModel.get(userId);
        return user || {};
    };

    async getUserByEmail({ email }) {
        const [user] = await userModel.getAll({ email });
        return user || {};
    };

    async updateUser({ userId, user } = {}) {
        if (user.password) {
            const { password } = user;
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        const updatedUserId = await userModel.update(
            userId,
            user
        );
        return updatedUserId;
    }

    async deleteUser({ userId }) {
        const deletedUserId = await userModel.delete(userId);
        return deletedUserId;
    }
}

module.exports = UserController;