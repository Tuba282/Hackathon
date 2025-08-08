
// export const uploadImage = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ success: false, message: "No file uploaded" });
//   }

//   const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

//   res.status(200).json({
//     success: true,
//     message: "Image uploaded successfully",
//     fileName: req.file.filename,
//     imageUrl,
//   });
//   return imageUrl
// };
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY } = process.env;

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_KEY,
  });

const unique_id = () => {
  return new Date().getTime().toString();
};

export const upload_image_contoller = async (req, res) => {
  try {
    // Support both express-fileupload (req.files.file) and multer (req.file)
    let file;
    if (req.files && req.files.file) {
      file = req.files.file;
    } else if (req.file) {
      file = req.file;
    } else {
      return res.status(400).json({ success: false, message: "No file uploaded. Make sure your frontend sends FormData with key 'file'." });
    }

    // For express-fileupload, file.data is a Buffer. For multer, file.buffer is a Buffer.
    const fileBuffer = file.data || file.buffer;
    if (!fileBuffer) {
      return res.status(400).json({ success: false, message: "File buffer missing. Check your upload middleware." });
    }

    const file_format = (file.name || file.originalname || '').split('.').pop();
    const file_type = (file.mimetype || '').split('/')[0];
    const file_name = file.name || file.originalname || 'upload';

    // Use Cloudinary upload_stream for buffer upload (cloud compatible)
    const streamifier = await import('streamifier');
    const stream = streamifier.default.createReadStream(fileBuffer);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: `${unique_id()}-${file_name.split('.')[0]}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Error during file upload:", error);
          return res.status(500).json({ success: false, message: "Upload failed", error });
        }
        return res.status(200).json({
          success: true,
          message: "File uploaded successfully",
          url: result.secure_url,
          file_type,
          file_format,
          name: file_name,
        });
      }
    );
    stream.pipe(uploadStream);
  } catch (error) {
    console.error("Error during file upload:", error);
    return res.status(500).json({ success: false, message: "Upload failed", error });
  }
};
