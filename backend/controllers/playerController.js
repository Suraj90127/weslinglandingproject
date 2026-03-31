const Player = require('../models/Player');
const uploadToImgBB = require('../utils/imgbbUpload');

// @desc    Get all players
// @route   GET /api/players
exports.getAllPlayers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    let query = Player.find();

    if (limit > 0) {
      query = query.limit(limit).skip(skip);
    }

    const players = await query.sort({ createdAt: -1 });
    const total = await Player.countDocuments();

    res.status(200).json({
      success: true,
      count: players.length,
      total,
      data: players
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Migrate legacy football-schema players to wrestling schema
// @route   POST /api/players/migrate-legacy
exports.migrateLegacyPlayers = async (req, res) => {
  try {
    // Find all players that still have old football fields (position or jerseyNumber)
    const legacyPlayers = await Player.find({ $or: [{ position: { $exists: true } }, { jerseyNumber: { $exists: true } }] });

    if (legacyPlayers.length === 0) {
      return res.status(200).json({ success: true, message: 'No legacy players to migrate', updated: 0 });
    }

    let updated = 0;
    for (const player of legacyPlayers) {
      await Player.updateOne(
        { _id: player._id },
        {
          $set: {
            // Map old fields to new ones if new fields are absent
            profession: player.profession || player.position || 'Wrestler',
            nativePlace: player.nativePlace || player.nationality || '',
            matchesWon: player.matchesWon || player.stats?.goals || 0,
            // Ensure socialMedia and contact sub-docs exist
            'socialMedia.instagram': player.socialMedia?.instagram || '',
            'socialMedia.facebook': player.socialMedia?.facebook || '',
            'socialMedia.youtube': player.socialMedia?.youtube || '',
          },
          $unset: {
            jerseyNumber: '',
            position: '',
            nationality: '',
            stats: ''
          }
        }
      );
      updated++;
    }

    res.status(200).json({
      success: true,
      message: `Migrated ${updated} legacy player(s) to the new wrestling schema`,
      updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get single player
// @route   GET /api/players/:id
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.status(200).json({
      success: true,
      data: player
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new player
// @route   POST /api/players
exports.createPlayer = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToImgBB(req.file.buffer, req.file.originalname);
    }

    const playerData = {
      ...req.body,
      image: imageUrl,
      socialMedia: JSON.parse(req.body.socialMedia || '{}'),
      contact: JSON.parse(req.body.contact || '{}')
    };

    const player = await Player.create(playerData);

    res.status(201).json({
      success: true,
      data: player
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update player
// @route   PUT /api/players/:id
exports.updatePlayer = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.body.socialMedia) {
      updateData.socialMedia = JSON.parse(req.body.socialMedia);
    }
    if (req.body.contact) {
      updateData.contact = JSON.parse(req.body.contact);
    }

    if (req.file) {
      const imageUrl = await uploadToImgBB(req.file.buffer, req.file.originalname);
      updateData.image = imageUrl;
    }

    const player = await Player.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.status(200).json({
      success: true,
      data: player
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete player
// @route   DELETE /api/players/:id
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    await player.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Player deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};