import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrophy, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaFire } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Tournaments = () => {
  const { events, loading } = useSelector((state) => state.events);

  // Fallback image if event has no image
  const defaultImg = "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80";

  // Helper to determine event status based on date
  const getEventStatus = (dateString) => {
    if (!dateString) return 'upcoming';
    const eventMs = new Date(dateString).getTime();
    if (isNaN(eventMs)) return 'upcoming'; // handle invalid dates
    const nowMs = Date.now();
    const diff = nowMs - eventMs; // positive = past
    if (diff > 2 * 60 * 60 * 1000) return 'previous';   // more than 2hrs ago
    if (diff >= -2 * 60 * 60 * 1000) return 'live';      // within ±2hrs window
    return 'upcoming';
  };

  // ─── Filter & Limit Events ──────────────────────────────────────────────────
  const filteredEvents = React.useMemo(() => {
    if (!events || !Array.isArray(events)) return [];

    // Sort events by date ascending (soonest first)
    const sorted = [...events].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });

    // Only show live and upcoming, limit to 6
    return sorted
      .filter(event => {
        const status = getEventStatus(event.date);
        return status === 'live' || status === 'upcoming';
      })
      .slice(0, 6);
  }, [events]);


  return (
    <section className="relative py-12 sm:py-20 bg-[#050505] overflow-hidden">
      {/* Cinematic Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-orange-600/10 blur-[80px] sm:blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-red-600/5 blur-[80px] sm:blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-20"
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em]">
            Live Global Events
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-[1000] text-white italic uppercase tracking-tighter mb-4 sm:mb-6 leading-none">
            BATTLE FOR <span className="text-orange-500">GLORY</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-lg md:text-xl max-w-3xl mx-auto font-medium px-4">
            Witness the collision of titans. Secure your spot in the arena or register to climb the official AWE rankings.
          </p>
        </motion.div>

        {/* Loading State - Card Skeleton */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] bg-neutral-900 animate-pulse rounded-[2rem] sm:rounded-[2.5rem] border border-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 max-w-7xl mx-auto">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => {
                // Extract data from API structure
                const rawDate = event.date ? new Date(event.date) : null;
                const eventDate = rawDate && !isNaN(rawDate.getTime())
                  ? rawDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : "TBD";
                const eventArena = event.venue?.split(',')[0] || "TBD Arena";
                const eventImage = event.image || event.thumbnail || defaultImg;
                const status = getEventStatus(event.date);

                return (
                  <motion.div
                    key={event._id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-neutral-900 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all duration-500 shadow-2xl"
                  >
                    {/* Image Container */}
                    <div className="relative h-56 sm:h-64 overflow-hidden">
                      <img
                        src={eventImage}
                        alt={event.title}
                        loading="lazy"
                        className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                        onError={(e) => { e.target.onerror = null; e.target.src = defaultImg }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex gap-2">
                        <span className={`px-3 py-1 sm:px-4 sm:py-1.5 backdrop-blur-md rounded-full text-[8px] sm:text-[9px] font-black text-white uppercase tracking-widest border border-white/10 flex items-center gap-2 ${status === 'live' ? 'bg-red-600/80 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-black/60'
                          }`}>
                          <FaFire className={`${status === 'live' ? 'text-white' : 'text-orange-500'} animate-pulse`} />
                          {status === 'live' ? "LIVE NOW" : status === 'upcoming' ? "Upcoming" : "Scheduled"}
                        </span>
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-6 sm:p-10 -mt-8 relative z-10">
                      <div className="mb-6">
                        <h3 className="text-2xl sm:text-3xl font-[1000] text-white uppercase italic leading-tight mb-2 truncate">
                          {event.title}
                        </h3>
                        <p className="text-orange-500 font-black text-xl sm:text-2xl tracking-tighter italic">
                          {event.category || "CHAMPIONSHIP"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8 sm:mb-10">
                        <TournamentStat icon={<FaUsers />} label="MATCHES" value={event.matches?.length || "TBD"} />
                        <TournamentStat icon={<FaCalendarAlt />} label="DATE" value={eventDate} />
                        <TournamentStat icon={<FaMapMarkerAlt />} label="ARENA" value={eventArena} />
                        <TournamentStat icon={<FaTicketAlt />} label="TICKETS" value="OPEN" />
                      </div>

                      <Link to={`/events`}>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 sm:py-5 bg-orange-600 text-white font-[1000] uppercase italic tracking-[0.2em] rounded-xl sm:rounded-2xl transition-all shadow-lg text-xs sm:text-sm"
                        >
                          View Details
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 bg-neutral-900/50 rounded-[2.5rem] border border-white/5">
                <FaTrophy className="text-orange-500/20 text-6xl mx-auto mb-4" />
                <p className="text-neutral-500 font-black uppercase tracking-widest text-sm">No Upcoming Battles Found</p>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-20">
          <Link to="/events" className="group relative inline-block">
            <span className="relative z-10 px-8 py-4 sm:px-12 sm:py-5 bg-transparent border-2 border-white/10 text-white font-black uppercase tracking-widest text-[10px] sm:text-xs rounded-xl sm:rounded-2xl hover:border-orange-500 transition-colors inline-block">
              Explore Full Season
            </span>
            <div className="absolute inset-0 bg-orange-600 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* Helper Component for Stats */
const TournamentStat = ({ icon, label, value }) => (
  <div className="flex flex-col min-w-0">
    <span className="flex items-center gap-1.5 text-[8px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">
      <span className="text-orange-500">{icon}</span> {label}
    </span>
    <span className="text-xs sm:text-sm font-bold text-white uppercase truncate">{value}</span>
  </div>
);

export default Tournaments;