const ContactQuery = require('../models/ContactQuery');

// @desc    Submit a contact query (public)
// @route   POST /api/contact
exports.submitQuery = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        const query = await ContactQuery.create({ name, email, subject, message });

        res.status(201).json({
            success: true,
            message: 'Your message has been received. We will get back to you shortly!',
            data: query
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all contact queries (admin only, paginated)
// @route   GET /api/contact
exports.getAllQueries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const queries = await ContactQuery.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ContactQuery.countDocuments();
        const unreadCount = await ContactQuery.countDocuments({ isRead: false });

        res.status(200).json({
            success: true,
            count: queries.length,
            total,
            unreadCount,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: queries
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark a query as read (admin only)
// @route   PUT /api/contact/:id/read
exports.markAsRead = async (req, res) => {
    try {
        const query = await ContactQuery.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!query) {
            return res.status(404).json({ success: false, message: 'Query not found' });
        }

        res.status(200).json({ success: true, data: query });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a contact query (admin only)
// @route   DELETE /api/contact/:id
exports.deleteQuery = async (req, res) => {
    try {
        const query = await ContactQuery.findByIdAndDelete(req.params.id);

        if (!query) {
            return res.status(404).json({ success: false, message: 'Query not found' });
        }

        res.status(200).json({ success: true, message: 'Query deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
