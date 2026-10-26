import { jest } from "@jest/globals";
import { beforeEach } from "node:test";
import { describe, expect, it } from "@jest/globals";
import { AuditLog } from "../../src/models/auditLogSchema.model.js";

// create mocks before importing the modules under test.
const userCreateMock = jest.fn<() => Promise<{
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
}[]>>();
const auditLogCreateMock = jest.fn<() => Promise<unknown[]>>();
const sendVerificationEmailMock = jest.fn<() => Promise<void>>();

const endSessionMock = jest.fn<() => Promise<void>>();
const withTransactionMock = jest.fn<
    (callback: () => Promise<unknown>) => Promise<void>
>();
const startSessionMock = jest.fn<() => Promise<{
    withTransaction: typeof withTransactionMock;
    endSession: typeof endSessionMock;
}>>();

jest.unstable_mockModule("../../src/models/user.model.js", () => ({
    default: {
        create: userCreateMock,
    }
}));

jest.unstable_mockModule("../../src/models/auditLogSchema.model.js", () => ({
    AuditLog: {
        create: auditLogCreateMock,
    }
}));

jest.unstable_mockModule("../../src/services/email.service.js", () => ({
    sendVerificationEmail: sendVerificationEmailMock,
}));


// Import after registering the ESM mocks.
const { register } = await import(
    "../../src/services/auth.service.js"
);

describe("registerUser", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        endSessionMock.mockResolvedValue(undefined);
        auditLogCreateMock.mockResolvedValue([]);

        sendVerificationEmailMock.mockResolvedValue(undefined);

        userCreateMock.mockResolvedValue([
            {
                _id: "user-123",
                fullName: "Kishor Pandey",
                email: "test@example.com",
                phone: "9840042981",
                password: "testuser34@#"
            },
        ]);

        withTransactionMock.mockImplementation(async (callback) => {
            await callback();
        });

        startSessionMock.mockResolvedValue({
            withTransaction: withTransactionMock,
            endSession: endSessionMock,
        });
    });

    it("should register a user successfully", async () => {

        const metaData = {
            ipAddress: "127.1.1.0",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        };

        const input = {
            fullName: "Test User",
            email: "test@example.com",
            phone: "9840042981",
            password: "SecurePassword123!",
        };

        const result = await register(input, metaData);

        // Assert
        expect(startSessionMock).toHaveBeenCalled();
        expect(withTransactionMock).toHaveBeenCalled();
        expect(userCreateMock).toHaveBeenCalled();
        expect(auditLogCreateMock).toHaveBeenCalled();
        expect(sendVerificationEmailMock).toHaveBeenCalled();
        expect(endSessionMock).toHaveBeenCalled();

        expect(result).toBeDefined();
    })
})