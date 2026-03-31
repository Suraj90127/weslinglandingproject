const Content = require('../models/Content');

// @desc    Get all content
// @route   GET /api/content
exports.getAllContent = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    let query = Content.find();

    if (limit > 0) {
      query = query.limit(limit).skip(skip);
    }

    const contents = await query.sort({ createdAt: -1 });
    const total = await Content.countDocuments();

    res.status(200).json({
      success: true,
      count: contents.length,
      total,
      data: contents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get content by type (dynamic)
// @route   GET /api/content/type/:type
exports.getContentByType = async (req, res) => {
  try {
    const content = await Content.findOne({
      type: req.params.type,
      isActive: true
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found for this type'
      });
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new content (any type)
// @route   POST /api/content
exports.createContent = async (req, res) => {
  try {
    // Check if content type already exists
    const existingContent = await Content.findOne({ type: req.body.type });
    if (existingContent) {
      return res.status(400).json({
        success: false,
        message: 'Content type already exists'
      });
    }

    // Parse metaData if it's a string
    let contentData = { ...req.body };
    if (contentData.metaData && typeof contentData.metaData === 'string') {
      contentData.metaData = JSON.parse(contentData.metaData);
    }

    const content = await Content.create(contentData);

    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
exports.updateContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Check if trying to update to an existing type
    if (req.body.type && req.body.type !== content.type) {
      const existingContent = await Content.findOne({
        type: req.body.type,
        _id: { $ne: req.params.id }
      });

      if (existingContent) {
        return res.status(400).json({
          success: false,
          message: 'Content type already exists'
        });
      }
    }

    // Parse metaData if it's a string
    let updateData = { ...req.body, updatedAt: Date.now() };
    if (updateData.metaData && typeof updateData.metaData === 'string') {
      updateData.metaData = JSON.parse(updateData.metaData);
    }

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedContent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    await content.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};