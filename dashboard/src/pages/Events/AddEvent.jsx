
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUpload, FiX, FiSave, FiArrowLeft, FiChevronDown, FiPlus, FiTrash2, FiUser } from 'react-icons/fi';
import { createEvent, updateEvent } from '../../redux/slices/eventSlice';
import { fetchPlayers } from '../../redux/slices/playerSlice';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const AddEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);
  const { players } = useSelector((state) => state.players);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [matches, setMatches] = useState([]);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [currentMatch, setCurrentMatch] = useState({
    name: '',
    player1: '',
    player2: ''
  });

  const dropdownRef = useRef(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Fetch players from API when component mounts
  useEffect(() => {
    dispatch(fetchPlayers());
  }, [dispatch]);

  // Load event data if editing
  useEffect(() => {
    if (id && events.length > 0) {
      const event = events.find(e => e._id === id);
      if (event) {
        setValue('title', event.title);
        setValue('description', event.description);
        setValue('venue', event.venue);
        setValue('date', event.date.split('T')[0]);
        setValue('time', event.time);
        setValue('status', event.status);
        setPreviewImage(event.image);

        if (event.players) {
          setSelectedPlayers(event.players.map(p => p._id));
        }

        if (event.matches && event.matches.length > 0) {
          setMatches(event.matches);
        }
      }
    }
  }, [id, events, setValue]);

  // Close dropdown if clicked outside
  useEffect(() => {
    if (!isDropdownOpen) return;

    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isDropdownOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlayerToggle = (playerId) => {
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  // Match Management
  const handleAddMatch = () => {
    if (!currentMatch.name || !currentMatch.player1 || !currentMatch.player2) {
      toast.error('Please fill all match fields');
      return;
    }

    if (currentMatch.player1 === currentMatch.player2) {
      toast.error('Please select two different players');
      return;
    }

    const newMatch = {
      id: Date.now().toString(),
      name: currentMatch.name,
      players: [currentMatch.player1, currentMatch.player2]
    };

    setMatches([...matches, newMatch]);
    setCurrentMatch({ name: '', player1: '', player2: '' });
    setShowMatchForm(false);
    toast.success('Match added successfully');
  };

  const handleRemoveMatch = (matchId) => {
    setMatches(matches.filter(m => m.id !== matchId));
    toast.success('Match removed');
  };

  const getPlayerName = (playerId) => {
    const player = players?.find(p => p._id === playerId);
    return player ? player.name : 'Unknown Player';
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      // Add selected players
      selectedPlayers.forEach(playerId => {
        formData.append('players[]', playerId);
      });

      // Add matches data
      if (matches.length > 0) {
        formData.append('matches', JSON.stringify(matches));
      }

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (id) {
        await dispatch(updateEvent({ id, data: formData })).unwrap();
        toast.success('Event updated successfully');
      } else {
        await dispatch(createEvent(formData)).unwrap();
        toast.success('Event created successfully');
      }

      navigate('/events');
    } catch (error) {
      toast.error(error || 'Operation failed');
    }
  };

  // Get selected player objects for display
  const selectedPlayerObjs = players?.filter(p => selectedPlayers.includes(p._id)) || [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/events')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {id ? 'Edit Event' : 'Add New Event'}
            </h1>
            <p className="text-gray-600 mt-1">
              {id ? 'Update event information and matches' : 'Create a new event with matches'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Event Details Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Event Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="input-field"
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows="3"
                className="input-field"
                placeholder="Event description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Venue */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('venue', { required: 'Venue is required' })}
                className="input-field"
                placeholder="Event venue/location"
              />
              {errors.venue && (
                <p className="mt-1 text-sm text-red-600">{errors.venue.message}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('date', { required: 'Date is required' })}
                className="input-field"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                {...register('time', { required: 'Time is required' })}
                className="input-field"
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select {...register('status')} className="input-field">
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-colors">
                <div className="space-y-1 text-center">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={getImageUrl(previewImage)}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setSelectedFile(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                          <span>Upload an image</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Players Selection from API */}
            <div className="md:col-span-2 relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Players for Event <span className="text-red-500">*</span>
              </label>

              {/* Selected Players Tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedPlayerObjs.map(player => (
                  <span key={player._id} className="inline-flex items-center bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
                    {player.name} {player.ringName ? `(${player.ringName})` : ''}
                    <button
                      type="button"
                      onClick={() => handlePlayerToggle(player._id)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Dropdown Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className="input-field flex items-center justify-between px-4 py-2 w-full cursor-pointer"
                >
                  <span className="text-gray-600">
                    {selectedPlayers.length === 0
                      ? 'Click to select players from list'
                      : `${selectedPlayers.length} player(s) selected`}
                  </span>
                  <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                </button>

                {/* Dropdown Menu with Players from API */}
                {isDropdownOpen && (
                  <div className="absolute z-30 mt-1 max-h-60 w-full bg-white rounded-xl border border-gray-300 shadow-lg overflow-y-auto">
                    {players && players.length > 0 ? (
                      <>
                        {players.map(player => (
                          <div
                            key={player._id}
                            className={`flex items-center hover:bg-gray-50 px-4 py-3 cursor-pointer border-b border-gray-100 last:border-0 ${selectedPlayers.includes(player._id) ? 'bg-primary-50' : ''
                              }`}
                            onClick={() => handlePlayerToggle(player._id)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedPlayers.includes(player._id)}
                              onChange={() => { }}
                              className="h-4 w-4 text-primary-600 rounded mr-3"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{player.name}</p>
                              <p className="text-xs text-gray-500">
                                {player.profession || 'Wrestler'} {player.ringName ? `• AKA ${player.ringName}` : ''}
                              </p>
                            </div>
                            {player.image && (
                              <img src={getImageUrl(player.image)} alt={player.name} className="w-8 h-8 rounded-full object-cover" />
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="py-8 px-4 text-center">
                        <p className="text-gray-500 mb-2">No players found</p>
                        <Link to="/players/add" className="text-primary-600 hover:underline text-sm">
                          Add players first
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {players?.length || 0} players available in system
              </p>
            </div>
          </div>
        </div>

        {/* Matches Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Matches</h2>
            <button
              type="button"
              onClick={() => setShowMatchForm(true)}
              className="btn-primary flex items-center text-sm"
              disabled={selectedPlayers.length < 2}
            >
              <FiPlus className="mr-2" size={16} />
              Add Match
            </button>
          </div>

          {selectedPlayers.length < 2 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-700">
                Please select at least 2 players from the list above before adding matches.
              </p>
            </div>
          )}

          {/* Add Match Form */}
          {showMatchForm && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-3">Add New Match</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Match Name</label>
                  <input
                    type="text"
                    value={currentMatch.name}
                    onChange={(e) => setCurrentMatch({ ...currentMatch, name: e.target.value })}
                    placeholder="e.g., Final Match"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Select Player 1</label>
                  <select
                    value={currentMatch.player1}
                    onChange={(e) => setCurrentMatch({ ...currentMatch, player1: e.target.value })}
                    className="input-field text-sm"
                  >
                    <option value="">Choose player...</option>
                    {selectedPlayerObjs.map(player => (
                      <option key={player._id} value={player._id}>
                        {player.name} {player.ringName ? `(${player.ringName})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Select Player 2</label>
                  <select
                    value={currentMatch.player2}
                    onChange={(e) => setCurrentMatch({ ...currentMatch, player2: e.target.value })}
                    className="input-field text-sm"
                  >
                    <option value="">Choose player...</option>
                    {selectedPlayerObjs.map(player => (
                      <option key={player._id} value={player._id}>
                        {player.name} {player.ringName ? `(${player.ringName})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowMatchForm(false);
                    setCurrentMatch({ name: '', player1: '', player2: '' });
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMatch}
                  className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Add Match
                </button>
              </div>
            </div>
          )}

          {/* Matches List */}
          {matches.length > 0 ? (
            <div className="space-y-2">
              {matches.map((match, index) => {
                const player1 = players?.find(p => p._id === match.players[0]);
                const player2 = players?.find(p => p._id === match.players[1]);
                return (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{match.name}</p>
                        <p className="text-sm text-gray-600">
                          {player1?.name || 'Unknown'} vs {player2?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMatch(match.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove match"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No matches added yet.</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Match" to create matches.</p>
            </div>
          )}

          {/* Match Summary */}
          {matches.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                <span className="font-medium">Total Matches:</span> {matches.length}
              </p>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || selectedPlayers.length === 0}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <FiSave className="mr-2" size={18} />
            )}
            {id ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;