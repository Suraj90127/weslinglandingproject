import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiUser, FiPhone, FiMail, FiMapPin,
  FiEdit2, FiTrash2, FiCalendar, FiAward, FiTarget, FiFlag
} from 'react-icons/fi';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import { fetchPlayerById, deletePlayer } from '../../redux/slices/playerSlice';
import { openModal } from '../../redux/slices/uiSlice';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const PlayerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedPlayer: player, loading } = useSelector((state) => state.players);

  useEffect(() => {
    if (id) dispatch(fetchPlayerById(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    dispatch(openModal({
      type: 'confirm',
      data: {
        title: 'Delete Player',
        message: `Delete "${player?.name}"? This cannot be undone.`,
        onConfirm: () => {
          dispatch(deletePlayer(id));
          toast.success('Player deleted');
          navigate('/players');
        }
      }
    }));
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!player) return (
    <div className="text-center py-20">
      <p className="text-gray-400 text-lg">Player not found</p>
      <Link to="/players" className="btn-primary mt-4 inline-block">Back to Players</Link>
    </div>
  );

  const hasSocial = player.socialMedia?.instagram || player.socialMedia?.facebook || player.socialMedia?.youtube;
  const hasContact = player.contact?.phone || player.contact?.email || player.contact?.address;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/players" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Player Profile</h1>
            <p className="text-gray-500 text-sm">View complete player information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/players/edit/${id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
            <FiEdit2 size={20} />
          </Link>
          <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Cover Banner */}
        <div className="h-40 bg-gradient-to-r from-primary-600 to-primary-400 relative">
          <div className="absolute -bottom-16 left-8">
            {player.image ? (
              <img
                src={getImageUrl(player.image)}
                alt={player.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-lg">
                <FiUser className="text-gray-400" size={48} />
              </div>
            )}
          </div>
          <div className="absolute bottom-4 right-8">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${player.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
              {player.isActive ? '● Active' : '○ Inactive'}
            </span>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          {/* Name & Basic Info */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{player.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {player.profession && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {player.profession}
                  </span>
                )}
                {player.ringName && (
                  <span className="text-gray-500 text-sm italic">AKA "{player.ringName}"</span>
                )}
                {player.nativePlace && (
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <FiFlag size={14} /> {player.nativePlace}
                  </span>
                )}
              </div>
            </div>
            {hasSocial && (
              <div className="flex gap-2">
                {player.socialMedia?.instagram && (
                  <a href={player.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-pink-50 text-pink-500 rounded-lg hover:bg-pink-100 transition-colors" title="Instagram">
                    <FaInstagram size={18} />
                  </a>
                )}
                {player.socialMedia?.facebook && (
                  <a href={player.socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Facebook">
                    <FaFacebook size={18} />
                  </a>
                )}
                {player.socialMedia?.youtube && (
                  <a href={player.socialMedia.youtube} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="YouTube">
                    <FaYoutube size={18} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard label="Matches Won" value={player.matchesWon ?? 0} color="orange" />
            <StatCard label="Height" value={player.height || '—'} color="green" />
            <StatCard label="Weight" value={player.weight || '—'} color="blue" />
            <StatCard label="Age" value={player.age ? `${player.age} Years` : '—'} color="purple" />
            <StatCard label="Chest" value={player.chest || '—'} color="pink" />
            <StatCard label="Biceps" value={player.biceps || '—'} color="teal" />
          </div>

          {/* Contact Information */}
          {hasContact && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-base font-semibold text-gray-700 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {player.contact?.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 flex items-center justify-center rounded-lg">
                      <FiPhone className="text-primary-500" size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-gray-800">{player.contact.phone}</p>
                    </div>
                  </div>
                )}
                {player.contact?.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 flex items-center justify-center rounded-lg">
                      <FiMail className="text-primary-500" size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-800">{player.contact.email}</p>
                    </div>
                  </div>
                )}
                {player.contact?.address && (
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <div className="w-9 h-9 bg-gray-100 flex items-center justify-center rounded-lg flex-shrink-0">
                      <FiMapPin className="text-primary-500" size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Address</p>
                      <p className="text-sm font-medium text-gray-800">{player.contact.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Metadata */}
          <div className="border-t border-gray-100 pt-6 mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Joined</p>
              <p className="font-medium text-gray-700">
                {new Date(player.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Last Updated</p>
              <p className="font-medium text-gray-700">
                {new Date(player.updatedAt || player.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colors = {
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    pink: 'bg-pink-50 text-pink-600',
    teal: 'bg-teal-50 text-teal-600',
  };
  return (
    <div className={`${colors[color]} rounded-xl p-4 text-center`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default PlayerDetails;