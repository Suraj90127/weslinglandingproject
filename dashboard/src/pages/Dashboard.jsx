import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiImage,
  FiCalendar,
  FiUsers,
  FiFileText,
  FiTrendingUp,
  FiClock,
  FiArrowRight,
  FiActivity,
  FiUserCheck,
  FiStar
} from 'react-icons/fi';
import { format } from 'date-fns';
import { getImageUrl } from '../utils/imageUtils';

import { fetchBanners } from '../redux/slices/bannerSlice';
import { fetchEvents } from '../redux/slices/eventSlice';
import { fetchPlayers } from '../redux/slices/playerSlice';
import { fetchAllContent } from '../redux/slices/contentSlice';

const Dashboard = () => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const { banners, loading: bannersLoading } = useSelector((state) => state.banners);
  const { events, upcomingEvents, loading: eventsLoading } = useSelector((state) => state.events);
  const { players, stats: playerStats, loading: playersLoading } = useSelector((state) => state.players);
  const { contents, loading: contentLoading } = useSelector((state) => state.contents);

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Fetch all data
    dispatch(fetchBanners());
    dispatch(fetchEvents());
    dispatch(fetchPlayers());
    dispatch(fetchAllContent());
  }, [dispatch]);

  useEffect(() => {
    // Create recent activities from data
    const activities = [];

    // Add recent events
    events?.slice(0, 3).forEach(event => {
      activities.push({
        id: `event-${event._id}`,
        type: 'event',
        title: event.title,
        time: new Date(event.createdAt),
        icon: FiCalendar,
        color: 'bg-green-100 text-green-600',
        link: `/events/${event._id}`
      });
    });

    // Add recent players
    players?.slice(0, 3).forEach(player => {
      activities.push({
        id: `player-${player._id}`,
        type: 'player',
        title: `${player.name}${player.profession ? ` - ${player.profession}` : player.position ? ` - ${player.position}` : ''}`,
        time: new Date(player.createdAt),
        icon: FiUsers,
        color: 'bg-purple-100 text-purple-600',
        link: `/players/${player._id}`
      });
    });

    // Add recent banners
    banners?.slice(0, 2).forEach(banner => {
      activities.push({
        id: `banner-${banner._id}`,
        type: 'banner',
        title: banner.title,
        time: new Date(banner.createdAt),
        icon: FiImage,
        color: 'bg-blue-100 text-blue-600',
        link: `/banners`
      });
    });

    // Sort by time and take latest 5
    setRecentActivities(
      activities
        .sort((a, b) => b.time - a.time)
        .slice(0, 5)
    );

  }, [events, players, banners]);

  const statCards = [
    {
      title: 'Total Banners',
      value: banners?.length || 0,
      icon: FiImage,
      color: 'from-blue-500 to-blue-600',
      lightColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      link: '/banners',
      loading: bannersLoading
    },
    {
      title: 'Total Events',
      value: events?.length || 0,
      icon: FiCalendar,
      color: 'from-green-500 to-green-600',
      lightColor: 'bg-green-50',
      iconColor: 'text-green-600',
      link: '/events',
      loading: eventsLoading
    },
    {
      title: 'Total Players',
      value: players?.length || 0,
      icon: FiUsers,
      color: 'from-purple-500 to-purple-600',
      lightColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      link: '/players',
      loading: playersLoading,
      subtext: `${playerStats?.activePlayers || 0} active`
    },
    {
      title: 'Content Pages',
      value: contents?.length || 0,
      icon: FiFileText,
      color: 'from-orange-500 to-orange-600',
      lightColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      link: '/content',
      loading: contentLoading
    },
  ];

  const quickStats = [
    {
      label: 'Upcoming Events',
      value: upcomingEvents?.length || 0,
      icon: FiClock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },

    {
      label: 'Content Types',
      value: contents?.length || 0,
      icon: FiActivity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Total Events',
      value: events?.length || 0,
      icon: FiStar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your events.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/events/add" className="btn-primary">
            Create Event
          </Link>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="card p-4 flex items-center space-x-4">
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`${stat.color}`} size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.lightColor} p-3 rounded-lg`}>
                <stat.icon className={stat.iconColor} size={24} />
              </div>
              {stat.loading ? (
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
              )}
            </div>
            <h3 className="text-gray-600 font-medium">{stat.title}</h3>
            {stat.subtext && (
              <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
            )}
            <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
              View Details <FiArrowRight className="ml-1" size={14} />
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Events</h2>
            <Link to="/events" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              View All <FiArrowRight className="ml-1" size={14} />
            </Link>
          </div>

          {eventsLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : upcomingEvents?.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.slice(0, 4).map((event) => (
                <Link
                  key={event._id}
                  to={`/events/${event._id}`}
                  className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {event.image ? (
                    <img
                      src={getImageUrl(event.image)}
                      alt={event.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FiCalendar className="text-primary-600" size={24} />
                    </div>
                  )}
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.venue}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <FiCalendar size={12} className="mr-1" />
                      {format(new Date(event.date), 'MMM dd, yyyy')}
                      <FiClock size={12} className="ml-3 mr-1" />
                      {event.time}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                    event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {event.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiCalendar className="mx-auto text-gray-400" size={48} />
              <p className="text-gray-500 mt-2">No upcoming events</p>
              <Link to="/events/add" className="btn-primary mt-4 inline-block">
                Create Event
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>

          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <Link
                  key={activity.id}
                  to={activity.link}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className={`${activity.color} p-2 rounded-lg`}>
                    <activity.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(activity.time, 'MMM dd, h:mm a')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiActivity className="mx-auto text-gray-400" size={48} />
              <p className="text-gray-500 mt-2">No recent activity</p>
            </div>
          )}

          {/* Player Profession Distribution */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Players by Profession</h3>
            <div className="space-y-2">
              {players && Object.entries(
                players.reduce((acc, p) => {
                  const key = p.profession || p.position || 'Unknown';
                  acc[key] = (acc[key] || 0) + 1;
                  return acc;
                }, {})
              ).map(([profession, count]) => (
                <div key={profession} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1 mr-2">{profession}</span>
                  <div className="flex items-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-800 mr-3">{count}</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${(count / (players.length || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/banners/add"
                className="text-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                Add Banner
              </Link>
              <Link
                to="/players/add"
                className="text-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                Add Player
              </Link>
              <Link
                to="/events/add"
                className="text-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                Add Event
              </Link>
              <Link
                to="/content"
                className="text-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                Manage Content
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;