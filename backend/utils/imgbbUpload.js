const axios = require("axios");
const FormData = require("form-data");

/**
 * Uploads an image buffer to ImgBB
 * @param {Buffer} buffer - Image file buffer
 * @param {string} filename - Original filename
 * @returns {Promise<string>} - ImgBB URL
 */
const uploadToImgBB = async (buffer, filename = 'image.jpg') => {
  try {
    const form = new FormData();
    // Append buffer with filename
    form.append("image", buffer, { filename });

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=91c718bf9a4bfbd6aa22c5f2fc90c8e0`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );

    if (res.data && res.data.data && res.data.data.url) {
      return res.data.data.url;
    } else {
      throw new Error("Invalid response from ImgBB");
    }
  } catch (error) {
    if (error.response) {
      console.error("ImgBB Upload Response Error:", error.response.data);
    } else {
      console.error("ImgBB Upload Error:", error.message);
    }
    throw error;
  }
};

module.exports = uploadToImgBB;