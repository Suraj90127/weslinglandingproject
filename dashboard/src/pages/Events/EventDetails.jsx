// EventDetails.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiTv,
  FiAward,
  FiChevronRight,
  FiShare2
} from 'react-icons/fi';
import { fetchEventById, deleteEvent } from '../../redux/slices/eventSlice';
import { openModal } from '../../redux/slices/uiSlice';
import { format } from 'date-fns';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedEvent: event, loading } = useSelector((state) => state.events);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
    }
  }, [dispatch, id]);

  const handleDelete = () => {
    dispatch(
      openModal({
        type: 'confirm',
        data: {
          title: 'Delete Event',
          message: `Are you sure you want to delete "${event?.title}"? This will also delete all associated matches and cannot be undone.`,
          onConfirm: async () => {
            try {
              await dispatch(deleteEvent(id)).unwrap();
              toast.success('Event deleted successfully');
              navigate('/events');
            } catch (error) {
              toast.error(error || 'Failed to delete event');
            }
          }
        }
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-800 border border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Helper function to get player name safely
  const getPlayerName = (playerId) => {
    if (!playerId || !event?.players) return 'Unknown Player';

    // Check if player is an object with name property (populated)
    if (typeof playerId === 'object' && playerId !== null && playerId.name) {
      return playerId.name;
    }

    // Otherwise find by ID in players array
    const player = event.players.find(p =>
      p._id === playerId || (typeof p === 'object' && p._id === playerId)
    );
    return player?.name || 'Unknown Player';
  };

  // Helper function to get player object
  const getPlayerObject = (playerId) => {
    if (!playerId || !event?.players) return null;

    // Check if player is already populated
    if (typeof playerId === 'object' && playerId !== null) {
      return playerId;
    }

    // Otherwise find by ID
    return event.players.find(p =>
      p._id === playerId || (typeof p === 'object' && p._id === playerId)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <FiCalendar className="text-red-600" size={40} />
        </div>
        <p className="mt-4 text-xl text-gray-600">Event not found</p>
        <p className="text-gray-500 mt-2">The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/events" className="btn-primary mt-6 inline-flex items-center">
          <FiArrowLeft className="mr-2" />
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Link
              to="/events"
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Events"
            >
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{event.title}</h1>
              <p className="text-gray-600 mt-1">Event Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Share Event"
            >
              <FiShare2 size={20} />
            </button>
            <Link
              to={`/events/edit/${id}`}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Event"
            >
              <FiEdit2 size={20} />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Event"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section with Image */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {event.image ? (
          <div className="relative h-96">
            <img
              src={getImageUrl(event.image)}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-3 ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
              <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
              <p className="text-white/90 line-clamp-2">{event.description}</p>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-3 bg-white/20`}>
              {event.status}
            </span>
            <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
            <p className="text-white/90">{event.description}</p>
          </div>
        )}
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-primary-500">
          <div className="flex items-center">
            <FiMapPin className="text-primary-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-500">Venue</p>
              <p className="font-medium text-gray-800">{event.venue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <FiCalendar className="text-green-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium text-gray-800">
                {format(new Date(event.date), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <div className="flex items-center">
            <FiClock className="text-purple-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium text-gray-800">{event.time}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
          <div className="flex items-center">
            <FiUsers className="text-orange-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-500">Participants</p>
              <p className="font-medium text-gray-800">{event.players?.length || 0} Players</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'players'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Players ({event.players?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'matches'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Matches ({event.matches?.length || 0})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">About This Event</h3>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Event Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Created</span>
                      <span className="text-gray-800 font-medium">
                        {format(new Date(event.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="text-gray-800 font-medium">
                        {format(new Date(event.updatedAt || event.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Event Date</span>
                      <span className="text-gray-800 font-medium">
                        {format(new Date(event.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Quick Stats</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Players</span>
                      <span className="text-gray-800 font-medium">{event.players?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Matches</span>
                      <span className="text-gray-800 font-medium">{event.matches?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Players Tab */}
          {activeTab === 'players' && (
            <div>
              {event.players && event.players.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.players.map((player) => (
                    <Link
                      key={player._id}
                      to={`/players/${player._id}`}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all group"
                    >
                      <div className="relative">
                        {player.image ? (
                          <img
                            src={getImageUrl(player.image)}
                            alt={player.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary-200 group-hover:border-primary-500 transition-colors"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center border-2 border-primary-200 group-hover:border-primary-500">
                            <FiUser className="text-primary-600" size={24} />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                          {player.name}
                        </h4>
                        <p className="text-sm text-gray-600">{player.profession || 'Wrestler'}</p>
                        {player.ringName && <p className="text-xs text-gray-500 mt-1">AKA {player.ringName}</p>}
                      </div>
                      <FiChevronRight className="text-gray-400 group-hover:text-primary-500 transition-colors" size={20} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <FiUsers className="text-gray-400" size={32} />
                  </div>
                  <p className="mt-4 text-gray-600">No players assigned to this event yet</p>
                  <Link
                    to={`/events/edit/${id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block"
                  >
                    Add Players
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Matches Tab - FIXED VERSION */}
          {activeTab === 'matches' && (
            <div>
              {event.matches && event.matches.length > 0 ? (
                <div className="space-y-4">
                  {event.matches.map((match, index) => {
                    // Get player objects safely
                    const player1Id = match.players?.[0];
                    const player2Id = match.players?.[1];

                    const player1 = getPlayerObject(player1Id);
                    const player2 = getPlayerObject(player2Id);

                    const player1Name = getPlayerName(player1Id);
                    const player2Name = getPlayerName(player2Id);

                    // Get winner info if exists
                    const winnerId = match.result?.winner;
                    const winnerName = winnerId ? getPlayerName(winnerId) : null;

                    return (
                      <div key={match._id || index} className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-5 border border-gray-200 hover:border-primary-200 transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-medium">
                                Match {index + 1}
                              </span>
                              <span className="text-sm text-gray-500">{match.name}</span>
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${match.status === 'completed' ? 'bg-green-100 text-green-700' :
                                match.status === 'ongoing' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                {match.status || 'scheduled'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between md:justify-start gap-4 md:gap-8">
                              {/* Player 1 */}
                              <div className="flex items-center gap-3 flex-1 md:flex-none">
                                {player1?.image ? (
                                  <img src={getImageUrl(player1.image)} alt={player1Name} className="w-12 h-12 rounded-full object-cover border-2 border-primary-200" />
                                ) : (
                                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center border-2 border-primary-200">
                                    <FiUser className="text-primary-600" size={20} />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-800">{player1Name}</p>
                                  <p className="text-xs text-gray-500">{player1?.profession || 'Wrestler'}</p>
                                </div>
                              </div>

                              {/* VS */}
                              <div className="text-center">
                                <span className="text-sm font-bold text-gray-400">VS</span>
                                {match.result?.score && (
                                  <div className="mt-1 text-xs font-semibold text-primary-600">
                                    {match.result.score}
                                  </div>
                                )}
                              </div>

                              {/* Player 2 */}
                              <div className="flex items-center gap-3 flex-1 md:flex-none">
                                {player2?.image ? (
                                  <img src={getImageUrl(player2.image)} alt={player2Name} className="w-12 h-12 rounded-full object-cover border-2 border-primary-200" />
                                ) : (
                                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center border-2 border-primary-200">
                                    <FiUser className="text-primary-600" size={20} />
                                  </div>
                                )}
                                <div className="text-right md:text-left">
                                  <p className="font-medium text-gray-800">{player2Name}</p>
                                  <p className="text-xs text-gray-500">{player2?.profession || 'Wrestler'}</p>
                                </div>
                              </div>
                            </div>

                            {/* Winner Info */}
                            {match.result?.winner && winnerName && (
                              <div className="mt-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                <FiAward size={16} />
                                <span>Winner: {winnerName}</span>
                              </div>
                            )}

                            {/* Match Notes */}
                            {match.result?.notes && (
                              <div className="mt-2 text-xs text-gray-500">
                                Notes: {match.result.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <FiTv className="text-gray-400" size={32} />
                  </div>
                  <p className="mt-4 text-gray-600">No matches scheduled for this event yet</p>
                  <Link
                    to={`/events/edit/${id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block"
                  >
                    Add Matches
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;