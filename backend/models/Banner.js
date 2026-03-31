const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a banner name'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
 
  image: {
    type: String,
 
  },
  images: [{
    type: String,
   
  }],
  link: {
    type: String,
    trim: true
  },
  position: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  pageType: {
    type: String,
    default: 'custom'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field to get all images (combine image and images)
bannerSchema.virtual('allImages').get(function() {
  if (this.images && this.images.length > 0) {
    return this.images;
  }
  if (this.image) {
    return [this.image];
  }
  return [];
});

// Set virtuals to true when converting to JSON
bannerSchema.set('toJSON', { virtuals: true });
bannerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Banner', bannerSchema);