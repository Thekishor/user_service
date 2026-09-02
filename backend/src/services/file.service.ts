import { AppError } from "../utils/AppError";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";

export const fileService =
    async (file: Express.Multer.File, publicId: string | null) => {

        let imageUrl = '';
        let imagePublicId = '';

        if (!file) {
            throw new AppError("Profile image is required", 400, "PROFILE_IMAGE_REQUIRED");
        }

        if (!file.mimetype.startsWith("image/")) {
            throw new AppError("Only image files are allowed", 400, "INVALID_FILE_TYPE");
        }

        if (file?.path) {

            const uploadedFile = await uploadOnCloudinary(file.path);

            if (uploadedFile) {

                // delete old image
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }

                // new image information
                imageUrl = uploadedFile.secure_url;
                imagePublicId = uploadedFile.public_id;
            }
        }

        return { imageUrl, imagePublicId };
    }