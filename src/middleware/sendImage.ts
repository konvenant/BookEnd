const cloudinary = require('cloudinary').v2;

export const sendImage = async (file:any) => {
    try {
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url; // URL of the uploaded image
    } catch (error) {
      // Handle error
      console.error('Error uploading image:', error);
      throw error;
    }
  };