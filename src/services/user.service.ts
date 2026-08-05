import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";

export const getUsersService = async () => {

    const users = await User.find({},
                {
                    fullName: 1,
                    email: 1,
                    phone: 1,
                    role: 1,
                    isEmailVerified: 1,
                    isAccountActive: 1,
                    createdAt: 1
                }
            ).sort({createdAt: -1});  
            
            if (!users) {
                return [];
            }

            return users.map(user => ({
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                isAccountActive: user.isAccountActive,
                createdAt: user.createdAt
            }));
};

export const deleteUser =
    async (userId: string) => {

        const user = await User.findById(userId);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        await User.deleteOne({ _id: userId });
    }