// EventList.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMapPin,
  FiClock,
  FiSearch,
  FiFilter,
  FiTv,
  FiUsers
} from 'react-icons/fi';
import { fetchEvents, deleteEvent } from '../../redux/slices/eventSlice';
import { openModal } from '../../redux/slices/uiSlice';
import { format } from 'date-fns';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const EventList = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState([]);




  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    let filtered = events || [];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  }, [searchTerm, statusFilter, events]);

  const handleDelete = (id, title) => {
    dispatch(
      openModal({
        type: 'confirm',
        data: {
          title: 'Delete Event',
          message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
          onConfirm: async () => {
            try {
              await dispatch(deleteEvent(id)).unwrap();
              toast.success('Event deleted successfully');
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

  // Helper function to get player name safely
  const getPlayerName = (playerId, players) => {
    if (!playerId || !players) return 'Unknown';

    // Check if player is an object with name property (populated)
    if (typeof playerId === 'object' && playerId !== null && playerId.name) {
      return playerId.name;
    }

    // Otherwise find by ID in players array
    const player = players.find(p =>
      p._id === playerId || (typeof p === 'object' && p._id === playerId)
    );
    return player?.name || 'Unknown';
  };

  if (loading && !events.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Events</h1>
          <p className="text-gray-600 mt-1">Manage all your events and matches</p>
        </div>
        <Link
          to="/events/add"
          className="btn-primary flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="mr-2" size={18} />
          Add New Event
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events by title, venue, or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center justify-end text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
            <FiCalendar className="mr-2" />
            <span className="font-medium">{filteredEvents.length}</span> events found
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading && events.length ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary-200 group"
            >
              <div className="flex flex-col h-full">
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-r from-primary-500 to-primary-600">
                  {event.image ? (
                    <img
                      src={getImageUrl(event.image)}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <FiCalendar size={48} />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full shadow-sm ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>

                  {/* Date Badge */}
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {event.description}
                  </p>

                  {/* Details Grid */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-2 flex-shrink-0 text-primary-500" size={16} />
                      <span className="text-sm truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiClock className="mr-2 flex-shrink-0 text-primary-500" size={16} />
                      <span className="text-sm">{event.time}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 py-3 border-t border-gray-100">
                    {event.players && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FiUsers className="mr-1 text-primary-500" size={16} />
                        <span>{event.players.length} Players</span>
                      </div>
                    )}

                    {event.matches && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FiTv className="mr-1 text-primary-500" size={16} />
                        <span>{event.matches.length} Matches</span>
                      </div>
                    )}
                  </div>

                  {/* Matches Preview - FIXED VERSION */}
                  {event.matches && event.matches.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-2">Matches:</p>
                      <div className="space-y-1">
                        {event.matches.slice(0, 2).map((match, idx) => {
                          const player1Id = match.players?.[0];
                          const player2Id = match.players?.[1];

                          const player1Name = getPlayerName(player1Id, event.players);
                          const player2Name = getPlayerName(player2Id, event.players);

                          return (
                            <div key={idx} className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded flex justify-between items-center">
                              <span className="font-medium">{match.name}</span>
                              <span>{player1Name} vs {player2Name}</span>
                            </div>
                          );
                        })}
                        {event.matches.length > 2 && (
                          <div className="text-xs text-primary-600 font-medium mt-1">
                            +{event.matches.length - 2} more matches
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex justify-end space-x-2 pt-2">
                    <Link
                      to={`/events/${event._id}`}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FiEye size={18} />
                    </Link>
                    <Link
                      to={`/events/edit/${event._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Event"
                    >
                      <FiEdit2 size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(event._id, event.title)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Event"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <FiCalendar className="text-primary-600" size={40} />
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">No events found</h3>
          <p className="mt-2 text-gray-600 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'No events match your current filters. Try adjusting your search criteria.'
              : 'Get started by creating your first event and adding matches to it.'}
          </p>
          {searchTerm || statusFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="btn-secondary mt-6 inline-flex items-center"
            >
              Clear Filters
            </button>
          ) : (
            <Link to="/events/add" className="btn-primary mt-6 inline-flex items-center">
              <FiPlus className="mr-2" size={18} />
              Add Your First Event
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default EventList;