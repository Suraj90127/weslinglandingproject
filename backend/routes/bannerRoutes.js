const express = require('express');
const router = express.Router();
const {
  getAllBanners,
  getBannerByPage,
  createBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/bannerController');
const upload = require('../middleware/upload');

// Change to array upload for multiple files
router.route('/')
  .get(getAllBanners)
  .post(upload.array('images', 10), createBanner); // Max 10 images

router.get('/page/:name', getBannerByPage);

router.route('/:id')
  .put(upload.array('images', 10), updateBanner)
  .delete(deleteBanner);

module.exports = router;