import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { redisOperation } from "../utils/redis.operation.js";

export const getUsersService = async (adminId: string) => {

    // getting data from Redis
    const key = `users:all:${adminId}`;
    const cached = await redisOperation.get(key);

    if (cached) {
        return JSON.parse(cached);
    }

    // getting all users with total
    const allUsers = await User.find({},
        {
            fullName: 1,
            email: 1,
            phone: 1,
            role: 1,
            isEmailVerified: 1,
            isAccountActive: 1,
            createdAt: 1
        }
    ).sort({ createdAt: -1 });

    // getting active users count
    const validUsers = await User.countDocuments({ isAccountActive: true });

    // getting inactive users count
    const invalidUsers = await User.countDocuments({ isAccountActive: false });

    // email unverified users count
    const unverifiedUsers = await User.countDocuments({ isEmailVerified: false });

    if (!allUsers || allUsers.length === 0) {
        return [];
    }

    if (validUsers === 0 && invalidUsers === 0 && unverifiedUsers === 0) {
        return [];
    }

    const users = allUsers.map(user => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isAccountActive: user.isAccountActive,
        createdAt: user.createdAt
    }));

    const totalUsers = users.length;
    const activeUsers = validUsers;
    const inactiveUsers = invalidUsers;

    //set data in Redis
    await redisOperation.setEx(
        key,
        600,
        JSON.stringify({
            users,
            totalUsers,
            activeUsers,
            inactiveUsers,
            unverifiedUsers,
        })
    );

    return {
        users,
        totalUsers,
        activeUsers,
        inactiveUsers,
        unverifiedUsers,
    }
};

export const deleteUser =
    async (userId: string, adminId: string) => {

        const user = await User.findById(userId);

        if (!user) {
            throw new AppError("User not found", 404, "USER_NOT_FOUND");
        }

        await Session.deleteMany({
            user: userId,
        });

        await User.deleteOne({ _id: userId });

        //delete cached data 
        const key = `users:all:${adminId}`;
        await redisOperation.del(key);

    }