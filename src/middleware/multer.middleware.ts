import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        // Use a cryptographically secure random suffix
        const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
        files: 1,
    },
});