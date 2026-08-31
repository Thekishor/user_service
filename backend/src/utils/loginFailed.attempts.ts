import { AppError } from "./AppError";
import { redisOperation } from "./redis.operation";

export const loginFailed = async (userId: string) => {

    const userKey = `LOGIN_ATTEMPTS:${userId}`;

    // getting from redis
    const loginAttempt = await redisOperation.get(userKey);
    let parseLoginAttempt = null;

    if (!loginAttempt) {
        await redisOperation.setEx(
            userKey,
            900,
            "1"
        );
    } else {
        parseLoginAttempt = JSON.parse(loginAttempt);
        await redisOperation.setEx(
            userKey,
            900,
            (parseLoginAttempt + 1).toString()
        );
    }

    if (parseLoginAttempt && parseLoginAttempt >= 5) {

        await redisOperation.setEx(
            userKey,
            900,
            JSON.stringify(parseLoginAttempt + 1)
        )

        throw new AppError(
            `Too many failed login attempts. Please try again after 15 minutes.`,
            429,
            "TOO_MANY_FAILED_ATTEMPTS"
        );
    }

    return false;
}

export const loginSuccess = async (userId: string) => {
    const userKey = `LOGIN_ATTEMPTS:${userId}`;
    await redisOperation.del(userKey);
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
            `Too many failed login attempts. Please try again after ${minute} ${minute > 1 ? "minutes" : "minute"}.`,
            429,
            "TOO_MANY_FAILED_ATTEMPTS"
        );
    }
};