const express = require('express');
const router = express.Router();
const {
    submitQuery,
    getAllQueries,
    markAsRead,
    deleteQuery
} = require('../controllers/contactController');
const protect = require('../middleware/auth');

// Public: submit a contact query
router.post('/', submitQuery);

// Admin: get all queries (paginated)
router.get('/', protect, getAllQueries);

// Admin: mark as read / delete
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteQuery);

module.exports = router;
