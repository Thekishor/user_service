import { v2 as cloudinary } from "cloudinary";
import { unlink } from "node:fs/promises";
import { logError } from "../config/logger";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if (!localFilePath) return null;

        return await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

    } catch (error) {
        logError("Cloudinary upload failed:", error);
        return null;
    } finally {
        if (localFilePath) {
            await unlink(localFilePath).catch(() => { });
        }
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