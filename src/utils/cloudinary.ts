import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Ensures all generated URLs use HTTPS
});

const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if (!localFilePath) return null;

        return await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return null;
    } finally {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
}

export { uploadOnCloudinary }