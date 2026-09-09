import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { randomBytes } from "node:crypto";
import { logError } from "../config/logger.js";
import { AppError } from "./AppError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (buffer: Buffer): Promise<UploadApiResponse | null> => {
    try {
        if (!buffer) return null;

        const uniqueName =
            `image-${Date.now()}-${randomBytes(8).toString("hex")}`;

        return await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { public_id: uniqueName, resource_type: "image" },
                (error, result) => {
                    if (error) reject(new AppError("Cloudinary upload failed", 500, "CLOUDINARY_UPLOAD_FAILED"));
                    else resolve(result ?? null);
                }
            );
            stream.end(buffer);
        });
    } catch (error) {
        logError("Cloudinary upload failed:", error);
        return null;
    }
}

const deleteFromCloudinary = async (publicId: string) => {
    try {
        if (!publicId) return null;

        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        logError("Cloudinary deletion failed:", error);
        return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }