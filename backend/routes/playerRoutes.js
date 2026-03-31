const express = require('express');
const router = express.Router();
const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  migrateLegacyPlayers
} = require('../controllers/playerController');
const upload = require('../middleware/upload');

router.route('/')
  .get(getAllPlayers)
  .post(upload.single('image'), createPlayer);

// Migration route — converts old football-schema players to wrestling schema
router.post('/migrate-legacy', migrateLegacyPlayers);

router.route('/:id')
  .get(getPlayerById)
  .put(upload.single('image'), updatePlayer)
  .delete(deletePlayer);

module.exports = router;