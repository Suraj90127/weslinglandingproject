import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaTicketAlt,
    FaClock,
    FaPlayCircle
} from "react-icons/fa";
import { GiTrophyCup, GiBattleGear } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../redux/slices/eventSlice';
import { Link } from 'react-router-dom';

// Helper function to format date
const formatEventDate = (dateString) => {
    if (!dateString) return { date: "TBD", day: "TBD", time: "TBD" };
    const date = new Date(dateString);
    return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
};

const getPlaceholderImage = () => "https://via.placeholder.com/150/FF6B00/FFFFFF?text=AWE";

// --- Sub-Components ---
const BackgroundPulse = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-orange-600 rounded-full blur-[80px] sm:blur-[120px]"
        />
    </div>
);

const PlayerDisplay = ({ image, name }) => {
    // Construct full image URL if it's a relative path
    const getImageUrl = (imgPath) => {
        if (!imgPath) return getPlaceholderImage();
        if (imgPath.startsWith('http')) return imgPath;
        // Adjust this base URL according to your API
        return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imgPath}`;
    };

    return (
        <div className="flex flex-col items-center gap-2 sm:gap-4 group/player">
            <div className="relative">
                <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-0 lg:group-hover/player:opacity-40 transition-opacity duration-500" />
                <img
                    src={getImageUrl(image)}
                    alt={name || "TBD"}
                    loading="lazy"
                    className="w-16 h-16 sm:w-20 md:w-28 h-16 sm:h-20 md:h-28 rounded-full object-cover border-2 sm:border-4 border-white/10 relative z-10 transition-all duration-500 group-hover/player:border-orange-500"
                    onError={(e) => { e.target.src = getPlaceholderImage(); }}
                />
            </div>
            <span className="text-white font-black text-[10px] sm:text-sm md:text-lg uppercase italic tracking-tighter text-center max-w-[80px] sm:max-w-[120px] leading-none group-hover/player:text-orange-400 transition-colors truncate">
                {name || "TBD"}
            </span>
        </div>
    );
};

const InfoBox = ({ icon, label, value, color }) => (
    <div className="space-y-1">
        <div className={`flex items-center gap-1.5 ${color} text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-80`}>
            {icon} {label}
        </div>
        <div className="text-white font-bold text-xs sm:text-base truncate">{value || "TBD"}</div>
    </div>
);

const TrendingGames = () => {
    const [expandedId, setExpandedId] = useState(null);
    const dispatch = useDispatch();
    const { events, loading } = useSelector((state) => state.events);
    const { banners } = useSelector((state) => state.banners);
    const sponsorsBanner = banners?.find(
        item => item.pageType?.toLowerCase() === "sponsors"
    );
    console.log("sponsorsBanner", sponsorsBanner);

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    const transformedMatches = React.useMemo(() => {
        if (!events || events.length === 0) return [];
        const allMatches = [];
        events.forEach((event) => {
            if (event.matches && event.matches.length > 0) {
                event.matches.forEach((match, idx) => {
                    const p1 = match.players?.[0] || {};
                    const p2 = match.players?.[1] || {};
                    const fDate = formatEventDate(event.date);
                    allMatches.push({
                        id: match._id || `${event._id}-${idx}`,
                        image1: p1.image,
                        image2: p2.image,
                        player1: p1.name,
                        player2: p2.name,
                        matchId: match._id,
                        eventId: event._id,
                        eventDetails: {
                            arena: event.venue?.split(',')[0] || "TBD",
                            place: event.venue || "TBD",
                            time: fDate.time,
                            date: fDate.date,
                            eventName: event.title
                        }
                    });
                });
            }
        });
        return allMatches;
    }, [events]);

    return (
        <section className="relative py-12 sm:py-20 bg-[#0a0a0a] min-h-screen overflow-hidden text-white">
            <BackgroundPulse />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-20 px-4">
                    <span className="text-orange-500 font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-3 sm:mb-4 block">Main Stage Events</span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 leading-none">
                        Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">Matches</span>
                    </h1>
                    <div className="h-1.5 w-20 sm:w-32 bg-gradient-to-r from-orange-600 to-transparent mx-auto rounded-full" />
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto">
                        <div className="lg:col-span-2 space-y-4 sm:space-y-8">
                            {transformedMatches.map((match, index) => {
                                const isOpen = expandedId === match.id;
                                return (
                                    <motion.div
                                        key={match.id}
                                        layout
                                        className={`group relative rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border transition-all duration-500 ${isOpen ? 'border-orange-500/50 bg-white/10 shadow-2xl' : 'border-white/5 bg-white/[0.03]'
                                            }`}
                                    >
                                        <div
                                            className="p-5 sm:p-10 cursor-pointer flex flex-col md:flex-row items-center gap-6 sm:gap-8"
                                            onClick={() => setExpandedId(isOpen ? null : match.id)}
                                        >
                                            <div className="flex items-center justify-between flex-1 w-full gap-2 sm:px-4">
                                                <PlayerDisplay image={match.image1} name={match.player1} />
                                                <div className="text-2xl sm:text-4xl md:text-6xl font-black text-white/10 italic group-hover:text-orange-500/40 transition-colors">VS</div>
                                                <PlayerDisplay image={match.image2} name={match.player2} />
                                            </div>

                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:border-l border-white/10 md:pl-10 w-full md:w-48 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                                                <div className="flex items-center gap-2 text-yellow-500">
                                                    <GiTrophyCup className="text-xl sm:text-2xl" />
                                                    <span className="text-[10px] sm:text-sm font-black tracking-tighter text-white/60 uppercase">Main Event</span>
                                                </div>
                                                <div className="text-white/40 text-[8px] sm:text-[10px] font-black uppercase tracking-widest truncate max-w-[150px]">
                                                    {match.eventDetails?.eventName || "FEATURED"}
                                                </div>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="bg-black/20 px-6 sm:px-10 pb-6 sm:pb-10"
                                                >
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 sm:py-8 border-t border-white/10">
                                                        <InfoBox icon={<FaMapMarkerAlt />} label="Arena" value={match.eventDetails?.arena} color="text-orange-500" />
                                                        <InfoBox icon={<FaClock />} label="Time" value={match.eventDetails?.time} color="text-yellow-500" />
                                                        <InfoBox icon={<FaCalendarAlt />} label="Date" value={match.eventDetails?.date} color="text-orange-500" />
                                                        <InfoBox icon={<GiBattleGear />} label="Access" value="18+" color="text-red-500" />
                                                    </div>
                                                    <Link to={`/events/upcoming_match/${match.matchId || match.id}`}>
                                                        <button className="w-full py-4 sm:py-5 bg-gradient-to-r from-orange-600 to-yellow-500 text-white font-black rounded-xl sm:rounded-2xl shadow-xl uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-2">
                                                            <FaTicketAlt /> Match Details
                                                        </button>
                                                    </Link>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Right Sidebar - Hidden on small screens for better UX */}
                        <div className="hidden lg:block space-y-8">
                            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10">
                                <h3 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                                        <span className="relative h-3 w-3 rounded-full bg-orange-600"></span>
                                    </span>
                                    Live Feed
                                </h3>
                                <div className="space-y-6">
                                    <div className="relative pl-6 border-l-2 border-orange-500">
                                        <span className="text-[10px] font-black uppercase text-orange-500 block mb-1">Live</span>
                                        <p className="text-sm font-bold text-white">Main event tickets are now 95% sold out.</p>
                                    </div>
                                    <div className="relative pl-6 border-l-2 border-white/10">
                                        <span className="text-[10px] font-black uppercase text-white/30 block mb-1">1h ago</span>
                                        <p className="text-sm font-bold text-white/60">VIP Backstage passes are now available.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative group rounded-[2.5rem] overflow-hidden aspect-[3/4] border border-white/10">
                                <img
                                    src={sponsorsBanner?.images?.[0]}
                                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    alt="Featured"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
                                    <h4 className="text-3xl font-black uppercase italic mb-4 leading-none text-white">The Royal Rumble 2026</h4>
                                    <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-orange-500"><FaPlayCircle /> Watch Trailer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TrendingGames;


