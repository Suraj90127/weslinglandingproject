const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addMatch,
  updateMatch,
  deleteMatch
} = require('../controllers/eventController');
const upload = require('../middleware/upload');

// Main event routes
router.route('/')
  .get(getAllEvents)
  .post(upload.single('image'), createEvent);

router.route('/:id')
  .get(getEventById)
  .put(upload.single('image'), updateEvent)
  .delete(deleteEvent);

// Match routes
router.route('/:eventId/matches')
  .post(addMatch);

router.route('/:eventId/matches/:matchId')
  .put(updateMatch)
  .delete(deleteMatch);

module.exports = router;