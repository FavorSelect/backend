const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// 🔹 Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith("video/");
        return {
            folder: "uploads", // Your Cloudinary folder
            format: file.mimetype.split("/")[1], // Retain original format (jpeg, png, mp4, etc.)
            resource_type: isVideo ? "video" : "image", // Set resource type
            public_id: `${Date.now()}_${file.originalname.replace(/\s+/g, "_").replace(/\W+/g, "")}`, // Clean filename
        };
    },
});

// 🔹 Multer Middleware
const upload = multer({ storage });

module.exports = upload;
