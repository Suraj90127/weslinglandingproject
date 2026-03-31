const Banner = require('../models/Banner');
const uploadToImgBB = require('../utils/imgbbUpload');

// @desc    Get all banners
// @route   GET /api/banners
exports.getAllBanners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    let query = Banner.find();

    if (limit > 0) {
      query = query.limit(limit).skip(skip);
    }

    const banners = await query.sort({ position: 1, createdAt: -1 });
    const total = await Banner.countDocuments();

    res.status(200).json({
      success: true,
      count: banners.length,
      total,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get banner by name/page
// @route   GET /api/banners/page/:name
exports.getBannerByPage = async (req, res) => {
  try {
    const banners = await Banner.find({
      name: req.params.name,
      isActive: true
    }).sort({ position: 1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// @desc    Create new banner (ImgBB upload)
// @route   POST /api/banners
exports.createBanner = async (req, res) => {
  try {


    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    let imageUrls = [];

    for (let file of req.files) {

      const imageUrl = await uploadToImgBB(file.buffer, file.originalname);

      imageUrls.push(imageUrl);
    }

    const bannerData = {
      ...req.body,
      images: imageUrls,
      image: imageUrls[0] // primary image
    };

    const banner = await Banner.create(bannerData);

    res.status(201).json({
      success: true,
      data: banner
    });

  } catch (error) {
    console.error('Create Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// @desc    Update banner (ImgBB)
// @route   PUT /api/banners/:id
exports.updateBanner = async (req, res) => {
  try {
    let banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    let updatedData = { ...req.body };

    // ✅ Upload new images if exist
    if (req.files && req.files.length > 0) {
      let newImageUrls = [];

      for (let file of req.files) {
        const imageUrl = await uploadToImgBB(file.buffer, file.originalname);
        newImageUrls.push(imageUrl);
      }

      if (req.body.replaceImages === 'true') {
        updatedData.images = newImageUrls;
      } else {
        updatedData.images = [...(banner.images || []), ...newImageUrls];
      }
    }

    // ✅ Delete selected images (only from DB, ImgBB auto-hosted)
    if (req.body.deleteImages) {
      const imagesToDelete = JSON.parse(req.body.deleteImages);

      updatedData.images = (updatedData.images || banner.images).filter(
        img => !imagesToDelete.includes(img)
      );
    }

    // ✅ update primary image
    if (updatedData.images && updatedData.images.length > 0) {
      updatedData.image = updatedData.images[0];
    }

    banner = await Banner.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: banner
    });

  } catch (error) {
    console.error('Update Error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// @desc    Delete banner
// @route   DELETE /api/banners/:id
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    // ❌ ImgBB images delete nahi hote (optional API hoti hai)
    // ✅ sirf DB se remove kar rahe hain

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};