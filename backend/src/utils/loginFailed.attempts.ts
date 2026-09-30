import { AppError } from "./AppError.js";
import { redisOperation } from "./redis.operation.js";

export const loginFailed = async (userId: string) => {

    const userKey = `LOGIN_ATTEMPTS:${userId}`;

    // getting from redis
    const loginAttempt = await redisOperation.get(userKey);

    if (!loginAttempt) {
        await redisOperation.setEx(
            userKey,
            900,
            "1"
        );

        return 1;
    }

    const parseLoginAttempt = Number(loginAttempt);
    const nextAttempt = parseLoginAttempt + 1;

    await redisOperation.setEx(
        userKey,
        900,
        nextAttempt.toString()
    );

    if (nextAttempt >= 5) {
        throw new AppError(
            `You have been temporarily locked out due to too many failed login attempts. Please try again after 15 minutes.`,
            429,
            "TOO_MANY_FAILED_ATTEMPTS"
        );
    }

    return nextAttempt;
}

export const loginSuccess = async (userId: string, email: string, phone: string) => {
    const userKey = `LOGIN_ATTEMPTS:${userId}`;
    await redisOperation.del(userKey);
    await redisOperation.del(`user:login:email:${email}`);
    await redisOperation.del(`user:login:phone:${phone}`);
};

export const isUserLockedOut = async (userId: string) => {
    const userKey = `LOGIN_ATTEMPTS:${userId}`;
    const loginAttempt = await redisOperation.get(userKey);

    if (loginAttempt == null) {
        return;
    }

    const parseLoginAttempt = JSON.parse(loginAttempt);
    const ttl = await redisOperation.ttl(userKey);
    const minute = Math.ceil(ttl / 60);

    if (parseLoginAttempt >= 5) {
        throw new AppError(
            `You have been temporarily locked out due to too many failed login attempts. Please try again after ${minute} ${minute > 1 ? "minutes" : "minute"}.`,
            429,
            "TOO_MANY_FAILED_ATTEMPTS"
        );
    }
};