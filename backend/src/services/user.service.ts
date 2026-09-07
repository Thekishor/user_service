import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";

export const getUsersService = async () => {

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

    return {
        users: allUsers.map(user => ({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isAccountActive: user.isAccountActive,
            createdAt: user.createdAt
        })),
        totalUsers: allUsers.length,
        activeUsers: validUsers,
        inactiveUsers: invalidUsers,
        unverifiedUsers: unverifiedUsers
    }
};

export const deleteUser =
    async (userId: string) => {

        const user = await User.findById(userId);

        if (!user) {
            throw new AppError("User not found", 404, "USER_NOT_FOUND");
        }

        await User.deleteOne({ _id: userId });
    }