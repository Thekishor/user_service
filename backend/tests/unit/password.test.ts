import { describe, expect, it } from "@jest/globals";
import { comparePassword, hashPassword } from "../../src/utils/hash.js";

describe("Password utilities", () => {

    it("should hash a password", async () => {
        const password = "Correct7788899@@##";
        const hashedPassword = await hashPassword(password);

        expect(hashedPassword).not.toBe(password);
    });

    it("should match the correct password", async () => {
        const password = "Correct7788899@@##";
        const hashedPassword = await hashPassword(password);

        expect(await comparePassword(password, hashedPassword)).toBe(true);
    });

    it("should reject an incorrect password", async () => {
        const hashedPassword = await hashPassword("Correct7788899@334433#");

        expect(await comparePassword("Incorrect7788899@@##", hashedPassword)).toBe(false);
    });
});