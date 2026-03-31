const express = require('express');
const router = express.Router();
const {
  getAllContent,
  getContentByType,
  createContent,
  updateContent,
  deleteContent
} = require('../controllers/contentController');

router.route('/')
  .get(getAllContent)
  .post(createContent);

router.get('/type/:type', getContentByType);

router.route('/:id')
  .put(updateContent)
  .delete(deleteContent);

module.exports = router;