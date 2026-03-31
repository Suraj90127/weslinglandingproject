import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiUser,
  FiSearch,
  FiFilter,
  FiPhone,
  FiMail
} from 'react-icons/fi';
import { fetchPlayers, deletePlayer } from '../../redux/slices/playerSlice';
import { openModal } from '../../redux/slices/uiSlice';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const PlayerList = () => {
  const dispatch = useDispatch();
  const { players, loading, stats, totalPlayers } = useSelector((state) => state.players);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 10;
  const totalPages = Math.ceil((totalPlayers || 0) / limit) || 1;

  useEffect(() => {
    dispatch(fetchPlayers({ page, limit }));
  }, [dispatch, page]);

  useEffect(() => {
    let filtered = players;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (player) =>
          player.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.ringName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply location filter (nativePlace instead of position for example, or we can just filter by isActive)
    if (positionFilter !== 'all') {
      filtered = filtered.filter(player => player.isActive === (positionFilter === 'active'));
    }

    setFilteredPlayers(filtered);
  }, [searchTerm, positionFilter, players]);

  const handleDelete = (id, name) => {
    dispatch(
      openModal({
        type: 'confirm',
        data: {
          title: 'Delete Player',
          message: `Are you sure you want to delete "${name}"?`,
          onConfirm: () => {
            dispatch(deletePlayer(id));
            toast.success('Player deleted successfully');
          }
        }
      })
    );
  };

  const positions = ['All', 'Active', 'Inactive'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Players</h1>
          <p className="text-gray-600 mt-1">Manage your team players and staff</p>
        </div>
        <Link to="/players/add" className="btn-primary flex items-center">
          <FiPlus className="mr-2" size={18} />
          Add New Player
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-gray-600">Total Players</p>
          {/* FIXED: correct spelling, total count */}
          <p className="text-2xl font-bold text-gray-800">
            {Array.isArray(players) ? players.length : 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search players..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="input-field pl-10"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredPlayers.length} players found
          </div>
        </div>
      </div>

      {/* Players Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => (
            <div key={player._id} className="card overflow-hidden group">
              {/* Player Header with Image */}
              <div className="relative h-48 bg-gradient-to-r from-primary-500 to-primary-600">
                {player.image ? (
                  <img
                    src={getImageUrl(player.image)}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiUser className="text-white" size={64} />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${player.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {player.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-lg font-bold">{player.name}</p>
                  <p className="text-white/90 text-sm">
                    {player.profession || 'Wrestler'} {player.ringName ? `• AKA ${player.ringName}` : ''}
                  </p>
                </div>
              </div>

              {/* Player Stats */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Matches Won</p>
                    <p className="font-bold text-gray-800">{player.matchesWon || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Height / Weight</p>
                    <p className="font-bold text-green-600 whitespace-nowrap overflow-hidden text-ellipsis">
                      {player.height || '-'} / {player.weight || '-'}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                {player.contact && (
                  <div className="space-y-2 mb-4">
                    {player.contact.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FiPhone className="mr-2" size={14} />
                        {player.contact.phone}
                      </div>
                    )}
                    {player.contact.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FiMail className="mr-2" size={14} />
                        {player.contact.email}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                  <Link
                    to={`/players/${player._id}`}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <FiEye size={18} />
                  </Link>
                  <Link
                    to={`/players/edit/${player._id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(player._id, player.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FiUsers className="mx-auto text-gray-400" size={64} />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No players found</h3>
          <p className="mt-2 text-gray-600">
            {searchTerm || positionFilter !== 'all'
              ? 'No players match your filters'
              : 'Get started by adding your first player'}
          </p>
          {!searchTerm && positionFilter === 'all' && (
            <Link to="/players/add" className="btn-primary mt-6 inline-flex items-center">
              <FiPlus className="mr-2" size={18} />
              Add Your First Player
            </Link>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerList;