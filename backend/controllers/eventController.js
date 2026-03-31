const Event = require('../models/Event');
const uploadToImgBB = require('../utils/imgbbUpload');

// @desc    Get all events
// @route   GET /api/events
exports.getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    let query = Event.find();

    if (limit > 0) {
      query = query.limit(limit).skip(skip);
    }

    const events = await query
      .populate('players')
      .populate({
        path: 'matches.players',
        model: 'Player'
      })
      .populate({
        path: 'matches.result.winner',
        model: 'Player'
      })
      .sort({ date: -1 });

    const total = await Event.countDocuments();

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('players')
      .populate({
        path: 'matches.players',
        model: 'Player'
      })
      .populate({
        path: 'matches.result.winner',
        model: 'Player'
      });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  try {
    let eventData = { ...req.body };

    // Parse matches if they were sent as JSON string
    if (req.body.matches) {
      try {
        const parsedMatches = JSON.parse(req.body.matches);
        // Format matches to match the schema
        eventData.matches = parsedMatches.map(match => ({
          name: match.name,
          players: match.players || [],
          matchNumber: match.matchNumber || 1,
          status: match.status || 'scheduled'
        }));
      } catch (e) {
        console.log('Matches parsing error:', e);
      }
    }

    // Handle players array - check both formats
    if (req.body['players[]']) {
      eventData.players = Array.isArray(req.body['players[]'])
        ? req.body['players[]']
        : [req.body['players[]']];
    } else if (req.body.players) {
      eventData.players = Array.isArray(req.body.players)
        ? req.body.players
        : [req.body.players];
    }

    // Add image if uploaded
    if (req.file) {
      try {
        const imageUrl = await uploadToImgBB(req.file.buffer, req.file.originalname);
        eventData.image = imageUrl;
      } catch (uploadError) {
        console.error('ImgBB Upload Error:', uploadError);
      }
    }

    const event = await Event.create(eventData);

    // Populate the response
    const populatedEvent = await Event.findById(event._id)
      .populate('players')
      .populate('matches.players');

    res.status(201).json({
      success: true,
      data: populatedEvent
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    let eventData = { ...req.body };

    // Parse matches if they were sent as JSON string
    if (req.body.matches) {
      try {
        const parsedMatches = JSON.parse(req.body.matches);
        eventData.matches = parsedMatches.map(match => ({
          name: match.name,
          players: match.players || [],
          matchNumber: match.matchNumber || 1,
          status: match.status || 'scheduled'
        }));
      } catch (e) {
        console.log('Matches parsing error:', e);
      }
    }

    // Handle players array
    if (req.body['players[]']) {
      eventData.players = Array.isArray(req.body['players[]'])
        ? req.body['players[]']
        : [req.body['players[]']];
    } else if (req.body.players) {
      eventData.players = Array.isArray(req.body.players)
        ? req.body.players
        : [req.body.players];
    }

    // Add image if uploaded
    if (req.file) {
      try {
        const imageUrl = await uploadToImgBB(req.file.buffer, req.file.originalname);
        eventData.image = imageUrl;
      } catch (uploadError) {
        console.error('ImgBB Upload Error:', uploadError);
      }
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      eventData,
      {
        new: true,
        runValidators: true
      }
    ).populate('players')
      .populate('matches.players');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add match to event
// @route   POST /api/events/:id/matches
exports.addMatch = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Add match to event with required fields
    const newMatch = {
      name: req.body.name,
      players: req.body.players || [],
      matchNumber: event.matches.length + 1,
      status: req.body.status || 'scheduled'
    };

    event.matches.push(newMatch);
    await event.save();

    // Populate the new match
    const updatedEvent = await Event.findById(req.params.id)
      .populate('matches.players');

    const addedMatch = updatedEvent.matches[updatedEvent.matches.length - 1];

    res.status(201).json({
      success: true,
      data: addedMatch
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update match in event
// @route   PUT /api/events/:eventId/matches/:matchId
exports.updateMatch = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Find and update the match
    const match = event.matches.id(req.params.matchId);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    Object.assign(match, req.body);
    await event.save();

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete match from event
// @route   DELETE /api/events/:eventId/matches/:matchId
exports.deleteMatch = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Remove the match
    event.matches = event.matches.filter(
      match => match._id.toString() !== req.params.matchId
    );

    // Renumber remaining matches
    event.matches.forEach((match, index) => {
      match.matchNumber = index + 1;
    });

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Match deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};