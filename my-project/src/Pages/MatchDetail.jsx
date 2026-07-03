import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../Compontnts/Header'
import Footer from '../Compontnts/Footer'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaMapMarkerAlt, FaBolt, FaCrown, FaTrophy } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '../redux/slices/eventSlice'
import { getFullImageUrl } from '../utils/imageUtils'

const fallbackPlayer1 = "https://via.placeholder.com/400x500/FF6B00/FFFFFF?text=Player+1";
const fallbackPlayer2 = "https://via.placeholder.com/400x500/FF0000/FFFFFF?text=Player+2";

// Calculate time remaining from now until a target date
const calcTimeLeft = (targetDate) => {
    const diff = targetDate - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        expired: false,
    };
};

// Returns 'previous' | 'live' | 'upcoming'
const getMatchStatus = (targetDate) => {
    const diff = Date.now() - targetDate; // positive = past
    if (diff > 2 * 60 * 60 * 1000) return 'previous';  // more than 2hrs ago
    if (diff >= -2 * 60 * 60 * 1000) return 'live';    // within ±2hrs
    return 'upcoming';
};

// ─── Main Component ──────────────────────────────────────────────────────────
const MatchDetail = () => {
    const { Id } = useParams()
    const dispatch = useDispatch()
    const { events, loading } = useSelector((state) => state.events)

    // ── ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS ──────────────
    // Find match - this runs on every render
    const findMatch = () => {
        if (!events || events.length === 0) return null;
        
        // First try to find the event by ID directly (since match data is at event level)
        for (const event of events) {
            // Check if this event's _id matches the Id param
            if (event._id === Id) {
                const p1 = event.players?.[0];
                const p2 = event.players?.[1];
                return {
                    ...event,
                    eventData: event,
                    player1: p1?.name || 'TBD',
                    player2: p2?.name || 'TBD',
                    player1Image: p1?.image
                        ? (p1.image.startsWith('http') ? p1.image : getFullImageUrl(p1.image))
                        : null,
                    player2Image: p2?.image
                        ? (p2.image.startsWith('http') ? p2.image : getFullImageUrl(p2.image))
                        : null,
                    p1Stats: {
                        height: p1?.height,
                        weight: p1?.weight,
                        chest: p1?.chest,
                        biceps: p1?.biceps,
                        age: p1?.age,
                        matchesWon: p1?.matchesWon,
                        profession: p1?.profession,
                        nativePlace: p1?.nativePlace,
                    },
                    p2Stats: {
                        height: p2?.height,
                        weight: p2?.weight,
                        chest: p2?.chest,
                        biceps: p2?.biceps,
                        age: p2?.age,
                        matchesWon: p2?.matchesWon,
                        profession: p2?.profession,
                        nativePlace: p2?.nativePlace,
                    }
                };
            }
            
            // Also check if there are matches in the matches array (for future compatibility)
            if (event.matches?.length) {
                const found = event.matches.find(m => m._id === Id || m.id === Id);
                if (found) {
                    const p1 = found.players?.[0];
                    const p2 = found.players?.[1];
                    return {
                        ...found,
                        eventData: event,
                        player1: p1?.name || 'TBD',
                        player2: p2?.name || 'TBD',
                        player1Image: p1?.image
                            ? (p1.image.startsWith('http') ? p1.image : getFullImageUrl(p1.image))
                            : null,
                        player2Image: p2?.image
                            ? (p2.image.startsWith('http') ? p2.image : getFullImageUrl(p2.image))
                            : null,
                        p1Stats: {
                            height: p1?.height,
                            weight: p1?.weight,
                            chest: p1?.chest,
                            biceps: p1?.biceps,
                            age: p1?.age,
                            matchesWon: p1?.matchesWon,
                            profession: p1?.profession,
                            nativePlace: p1?.nativePlace,
                        },
                        p2Stats: {
                            height: p2?.height,
                            weight: p2?.weight,
                            chest: p2?.chest,
                            biceps: p2?.biceps,
                            age: p2?.age,
                            matchesWon: p2?.matchesWon,
                            profession: p2?.profession,
                            nativePlace: p2?.nativePlace,
                        }
                    };
                }
            }
        }
        return null;
    };

    const apiMatch = findMatch();

    // ── useEffect hooks ──────────────────────────────────────────────────────
    useEffect(() => {
        window.scrollTo(0, 0);
        if (!events || events.length === 0) {
            dispatch(fetchEvents());
        }
    }, [dispatch, events]);

    // ── State hooks ──────────────────────────────────────────────────────────
    const match = apiMatch || {
        id: Id,
        player1: 'Loading...',
        player2: 'Loading...',
        player1Image: null,
        player2Image: null,
        p1Stats: {},
        p2Stats: {},
        eventData: {
            title: '',
            venue: '',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
    };

    const eventData = match.eventData || {};
    const eventDate = eventData.date ? new Date(eventData.date) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const matchStatus = getMatchStatus(eventDate);
    
    const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(eventDate));
    const intervalRef = useRef(null);

    // ── useEffect for timer ──────────────────────────────────────────────────
    useEffect(() => {
        if (matchStatus !== 'upcoming') return;
        setTimeLeft(calcTimeLeft(eventDate));
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTimeLeft(calcTimeLeft(eventDate));
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [eventDate.toISOString(), matchStatus]);

    // ── NOW WE CAN HAVE CONDITIONAL RETURNS ──────────────────────────────────
    if (loading && (!events || events.length === 0)) {
        return <LoadingState />;
    }
    
    if (!loading && events && events.length > 0 && !apiMatch) {
        return <MatchNotFound />;
    }

    // ── Event details ────────────────────────────────────────────────────────
    const player1Name = match.player1 || 'TBD';
    const player2Name = match.player2 || 'TBD';
    const player1Image = match.player1Image || fallbackPlayer1;
    const player2Image = match.player2Image || fallbackPlayer2;
    const p1Stats = match.p1Stats || {};
    const p2Stats = match.p2Stats || {};

    const matchDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const matchDay = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
    const matchTime = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const venueParts = eventData.venue?.split(',') || [];
    const arena = venueParts[0]?.trim() || 'TBD';
    const place = venueParts.slice(1).join(',').trim() || eventData.venue || 'TBD';

    // ── Tale of the Tape rows ─────────────────────────────────────────────────
    const tapeRows = [
        { label: 'Height', p1: p1Stats.height, p2: p2Stats.height },
        { label: 'Weight', p1: p1Stats.weight, p2: p2Stats.weight },
        { label: 'Chest', p1: p1Stats.chest, p2: p2Stats.chest },
        { label: 'Biceps', p1: p1Stats.biceps, p2: p2Stats.biceps },
        { label: 'Age', p1: p1Stats.age ? `${p1Stats.age} Years` : null, p2: p2Stats.age ? `${p2Stats.age} Years` : null },
        { label: 'Matches Won', p1: p1Stats.matchesWon != null ? String(p1Stats.matchesWon) : null, p2: p2Stats.matchesWon != null ? String(p2Stats.matchesWon) : null },
        { label: 'From', p1: p1Stats.nativePlace, p2: p2Stats.nativePlace },
    ].filter(row => row.p1 || row.p2);

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-orange-600">
            <Header />

            {/* 1. PPV HEADER / HERO VS SECTION */}
            <div className="relative pt-24 sm:pt-32 pb-10 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
                </div>

                <div className="container mx-auto max-w-7xl relative z-10 px-4 sm:px-6">
                    <div className="flex flex-col lg:flex-row items-center">

                        {/* Player 1 */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="w-full lg:w-[45%] group"
                        >
                            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] aspect-[4/5] sm:aspect-square">
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                                <img
                                    src={player1Image}
                                    alt={player1Name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackPlayer1; }}
                                />
                                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
                                    <span className="bg-orange-600 text-white text-[8px] sm:text-[10px] font-black italic uppercase px-3 py-1 rounded-full tracking-widest">The Challenger</span>
                                </div>
                                <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-20">
                                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-[1000] italic uppercase tracking-tighter leading-none">{player1Name}</h2>
                                    {p1Stats.profession && (
                                        <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mt-1">{p1Stats.profession}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* VS */}
                        <div className="w-full lg:w-[10%] flex flex-col items-center justify-center z-30 -my-8 lg:my-0">
                            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="relative">
                                <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-40 animate-pulse" />
                                <div className="relative text-7xl sm:text-8xl md:text-9xl font-[1000] italic text-white tracking-tighter drop-shadow-2xl">VS</div>
                            </motion.div>
                            <FaBolt className="text-orange-500 text-xl sm:text-2xl animate-bounce mt-2" />
                        </div>

                        {/* Player 2 */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="w-full lg:w-[45%] group text-right"
                        >
                            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] aspect-[4/5] sm:aspect-square">
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                                <img
                                    src={player2Image}
                                    alt={player2Name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackPlayer2; }}
                                />
                                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
                                    <span className="bg-red-600 text-white text-[8px] sm:text-[10px] font-black italic uppercase px-3 py-1 rounded-full tracking-widest flex items-center gap-2">
                                        <FaCrown /> World Champion
                                    </span>
                                </div>
                                <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20">
                                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-[1000] italic uppercase tracking-tighter leading-none">{player2Name}</h2>
                                    {p2Stats.profession && (
                                        <p className="text-red-400 text-xs font-bold uppercase tracking-widest mt-1 text-right">{p2Stats.profession}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* 2. TALE OF THE TAPE — Real Player Data */}
            <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10">
                <div className="bg-neutral-900/50 border border-white/5 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] overflow-hidden">
                    {/* Header with player name badges */}
                    <div className="flex items-center">
                        <div className="flex-1 bg-orange-600 py-4 px-6 sm:px-10">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-200 mb-1">Challenger</p>
                            <p className="text-lg sm:text-2xl font-[1000] italic uppercase tracking-tighter leading-none truncate">{player1Name}</p>
                        </div>
                        <div className="px-4 sm:px-8 text-center shrink-0">
                            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] text-orange-500">Tale of<br />the Tape</p>
                        </div>
                        <div className="flex-1 bg-red-700 py-4 px-6 sm:px-10 text-right">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-200 mb-1">Champion</p>
                            <p className="text-lg sm:text-2xl font-[1000] italic uppercase tracking-tighter leading-none truncate">{player2Name}</p>
                        </div>
                    </div>

                    {/* Stat Rows */}
                    <div className="p-6 sm:p-10 space-y-0">
                        {tapeRows.length > 0 ? (
                            tapeRows.map((row, i) => (
                                <TapeRow key={row.label} label={row.label} p1={row.p1} p2={row.p2} striped={i % 2 === 0} />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <FaTrophy className="text-orange-500 text-4xl mx-auto mb-4" />
                                <p className="text-neutral-400 text-sm uppercase tracking-widest">Player stats will be available soon</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. STATUS BANNER — Previous / Live / Upcoming */}
            <div className={`py-8 sm:py-12 relative overflow-hidden ${matchStatus === 'previous' ? 'bg-neutral-800'
                : matchStatus === 'live' ? 'bg-red-700'
                    : 'bg-orange-600'
                }`}>
                <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative z-10">
                    <div className="text-center md:text-left">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/50">
                            {matchStatus === 'previous' ? 'Match Ended' : matchStatus === 'live' ? 'Broadcast Live' : 'Broadcast Starts In'}
                        </p>
                        <h4 className="text-2xl sm:text-3xl font-[1000] italic uppercase tracking-tighter text-white">
                            {matchStatus === 'previous' ? 'Previous Match' : matchStatus === 'live' ? 'Live Now!' : "Don't Miss The Bell"}
                        </h4>
                        <p className="text-white/60 text-xs mt-1">
                            {matchDate} • {matchDay} • {matchTime}
                        </p>
                    </div>

                    {matchStatus === 'previous' && (
                        <span className="bg-white/10 border border-white/20 text-white/60 font-black italic uppercase text-lg sm:text-2xl px-6 py-3 rounded-2xl">
                            🏆 Ended
                        </span>
                    )}
                    {matchStatus === 'live' && (
                        <span className="bg-white text-red-600 font-black italic uppercase text-xl sm:text-3xl px-6 py-3 rounded-2xl animate-pulse">
                            🔴 LIVE
                        </span>
                    )}
                    {matchStatus === 'upcoming' && (
                        <div className="flex gap-2 sm:gap-4">
                            <CompactTimer value={timeLeft.days} unit="Days" />
                            <CompactTimer value={timeLeft.hours} unit="Hrs" />
                            <CompactTimer value={timeLeft.minutes} unit="Min" />
                            <CompactTimer value={timeLeft.seconds} unit="Sec" active />
                        </div>
                    )}
                </div>
            </div>

            {/* 4. ARENA & LOGISTICS */}
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20">
                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                        <InfoCard
                            icon={<FaMapMarkerAlt />}
                            title="The Arena"
                            val={arena}
                            sub={place}
                        />
                        <InfoCard
                            icon={<FaCalendarAlt />}
                            title="The Schedule"
                            val={`${matchDate} • ${matchDay}`}
                            sub={`${matchTime} Local Time`}
                        />
                    </div>
                    <Link to="/events" className="bg-white p-6 sm:p-8 rounded-[2rem] flex flex-col justify-center items-center text-black text-center group hover:bg-orange-500 transition-colors">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-white mb-2">Tickets & Passes</p>
                        <span className="text-xl sm:text-2xl font-[1000] italic uppercase tracking-tighter group-hover:text-white">Book Your Seat</span>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const TapeRow = ({ label, p1, p2, striped }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`flex items-center gap-3 sm:gap-6 py-4 px-4 sm:px-6 rounded-xl ${striped ? 'bg-white/3' : ''}`}
    >
        {/* Player 1 value — left aligned */}
        <div className="flex-1 text-left">
            <span className="text-base sm:text-xl font-black italic uppercase text-orange-400 truncate block">
                {p1 || '—'}
            </span>
        </div>

        {/* Label — center */}
        <div className="shrink-0 text-center min-w-[80px] sm:min-w-[120px]">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">{label}</span>
        </div>

        {/* Player 2 value — right aligned */}
        <div className="flex-1 text-right">
            <span className="text-base sm:text-xl font-black italic uppercase text-red-400 truncate block">
                {p2 || '—'}
            </span>
        </div>
    </motion.div>
);

const CompactTimer = ({ value, unit, active }) => (
    <div className={`w-16 h-16 sm:w-22 sm:h-22 flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border-2 px-1
        ${active ? 'bg-white text-orange-600 border-white' : 'bg-transparent border-white/20 text-white'}`}>
        <span className="text-xl sm:text-3xl font-[1000] italic leading-none tabular-nums">
            {String(value).padStart(2, '0')}
        </span>
        <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-wide mt-0.5">{unit}</span>
    </div>
);

const InfoCard = ({ icon, title, val, sub }) => (
    <div className="bg-neutral-900/50 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5 flex items-start gap-4 sm:gap-6 hover:bg-neutral-800 transition-all">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-600/10 flex-shrink-0 flex items-center justify-center text-orange-500 text-lg sm:text-xl">
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">{title}</p>
            <p className="text-lg sm:text-xl font-bold text-white truncate">{val}</p>
            <p className="text-xs sm:text-sm text-neutral-500 truncate">{sub}</p>
        </div>
    </div>
);

const LoadingState = () => (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Loading Match...</p>
    </div>
);

const MatchNotFound = () => (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="text-3xl font-black uppercase italic text-white/30">Match Not Found</h2>
        <Link to="/events" className="text-orange-500 text-xs font-bold uppercase tracking-widest border-b border-orange-500 pb-1">
            View All Events
        </Link>
    </div>
);

export default MatchDetail;