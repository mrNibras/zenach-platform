/**
 * @desc    Handle image upload
 * @route   POST /api/upload
 * @access  Private/Admin
 */
const uploadImage = (req, res) => {
  if (req.file) {
    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: req.file.path, // The public URL provided by Cloudinary
    });
  } else {
    res.status(400);
    throw new Error('No image file uploaded or invalid format');
  }
};

module.exports = { uploadImage };