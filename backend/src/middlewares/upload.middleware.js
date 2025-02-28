import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Configure dotenv to load environment variables
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Set up multer storage
const storage = multer.memoryStorage(); // Store files in memory

// Function to upload images to Cloudinary
export const uploadToCloudinary = async (files) => {
  const uploadedImages = [];

  try {
    // Loop through all files and upload them to Cloudinary
    const uploadPromises = files.map((file) =>
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            public_id: uuidv4(), // Set unique public_id using uuidv4
            resource_type: 'auto', // This ensures the file is uploaded correctly based on its type (image, video, etc.)
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error details:', error); // Log the error details
              reject(new Error('Cloudinary upload failed'));
            } else {
              resolve(result);
            }
          }
        ).end(file.buffer); // You need to send the file buffer here to Cloudinary
      })
    );

    // Wait for all uploads to finish
    const uploadResults = await Promise.all(uploadPromises);

    // Push the Cloudinary image URL and additional info
    uploadResults.forEach((result, index) => {
      uploadedImages.push({
        src: result.secure_url, // Cloudinary secure URL
        alt: files[index].originalname, // Original file name
      });
    });

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.message);
    throw new Error('Cloudinary upload failed');
  }

  // Return array of uploaded image URLs
  console.log('Uploaded images:', uploadedImages);
  return uploadedImages;
};

// Function to delete images from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deleted from Cloudinary:', result);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error.message);
    throw new Error('Cloudinary delete failed');
  }
};


// Export different Multer options as needed
export const uploadArray = multer({ storage: storage }).any(); // This is where we export the `.any()` equivalent
