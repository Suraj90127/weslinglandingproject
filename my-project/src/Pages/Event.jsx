import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { FaMapMarkerAlt, FaTicketAlt, FaCircle } from 'react-icons/fa';

// Import your assets
import img1 from "../assets/images/event_img/AAA.png";
import img2 from "../assets/images/event_img/NXT.png";
import img3 from "../assets/images/event_img/RAW.png";
import img4 from "../assets/images/event_img/Rey_De_Reyes.png";
import img5 from "../assets/images/event_img/roadblock.png";
import img6 from "../assets/images/event_img/SmackDown.png";
import img7 from "../assets/images/event_img/WrestleMania.png";
import banner1 from "../assets/images/event_img/banner-image-1.jpeg";
import banner2 from "../assets/images/event_img/banner-image-2.jpg";
import banner3 from "../assets/images/event_img/banner-image-3.jpg";
import banner4 from "../assets/images/event_img/banner-image-4.jpeg";
import banner5 from "../assets/images/event_img/banner-image-5.jpg";
import banner6 from "../assets/images/event_img/banner-image-6.jpg";
import bannerImg3 from "../assets/images/bannerrr.PNG";

// Import components
import Header from '../Compontnts/Header';
import Footer from '../Compontnts/Footer';

// Import Redux slices
import { fetchEvents } from '../redux/slices/eventSlice';
import { fetchPlayers } from '../redux/slices/playerSlice';
import { fetchBanners, selectAllBanners } from '../redux/slices/bannerSlice';
import { getFullImageUrl } from '../utils/imageUtils';

const banners = [banner1, banner2, banner3, banner4, banner5, banner6];
const fallbackImages = [img1, img2, img3, img4, img5, img6, img7];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatEventDate = (dateString, timeString) => {
    if (!dateString) return { day: "TBD", date: "TBD", time: "TBD" };

    const date = new Date(dateString);

    let formattedTime = "TBD";
    if (timeString) {
        if (timeString.includes('AM') || timeString.includes('PM')) {
            formattedTime = timeString;
        } else {
            const [hours, minutes] = timeString.split(':').map(Number);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours % 12 || 12;
            formattedTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        }
    } else {
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        formattedTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    return {
        day: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
        time: formattedTime
    };
};

const getEventStatus = (dateString) => {
    if (!dateString) return 'upcoming';
    const eventMs = new Date(dateString).getTime();
    const nowMs = Date.now();
    const diff = nowMs - eventMs;
    if (diff > 2 * 60 * 60 * 1000) return 'previous';
    if (diff >= -2 * 60 * 60 * 1000) return 'live';
    return 'upcoming';
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Event = () => {
    const [openEventId, setOpenEventId] = useState(null);
    const dispatch = useDispatch();
    
    // Redux state
    const { events, loading } = useSelector((state) => state.events);
    const { players, loading: playersLoading } = useSelector((state) => state.players);
    const allBanners = useSelector(selectAllBanners);

    // Get events banners
    const eventsBanners = useMemo(() => {
        return allBanners?.filter(b => b.pageType === 'events' && b.isActive) || [];
    }, [allBanners]);

    // Extract player images from players data
    const playerImages = useMemo(() => {
        if (!players || players.length === 0) return [];
        return players
            .filter(player => player.image) // Only include players with images
            .map(player => {
                // Handle image URL - if it's a relative path, use getFullImageUrl
                if (player.image && !player.image.startsWith('http')) {
                    return getFullImageUrl(player.image);
                }
                return player.image;
            });
    }, [players]);

    // Dynamic banners - prioritize player images, then event banners, then default
    const dynamicBanners = useMemo(() => {
        // Use player images if available
        if (playerImages.length > 0) {
            return playerImages;
        }
        
        // Fallback to banner images from eventsBanners
        const collectedImages = eventsBanners.flatMap(b => b.allImages || []);
        if (collectedImages.length > 0) {
            return collectedImages;
        }
        
        // Final fallback to default banners
        return banners;
    }, [playerImages, eventsBanners]);

    const heroBannerImage = useMemo(() => {
        if (eventsBanners.length > 0 && eventsBanners[0].image) {
            return eventsBanners[0].image;
        }
        return bannerImg3;
    }, [eventsBanners]);

    // Fetch data on mount
    useEffect(() => {
        window.scrollTo(0, 0);
        if (!events || events.length === 0) {
            dispatch(fetchEvents());
        }
        if (!players || players.length === 0) {
            dispatch(fetchPlayers());
        }
        dispatch(fetchBanners({ limit: 0 }));
    }, [dispatch]);

    // Process events
    const { liveEvents, upcomingEvents, previousEvents } = useMemo(() => {
        if (!events || events.length === 0) return { liveEvents: [], upcomingEvents: [], previousEvents: [] };

        const transformed = events.map((event, index) => {
            const formattedDate = formatEventDate(event.date, event.time);
            const status = getEventStatus(event.date);
            
            let matches = event.matches || [];
            if (matches.length === 0 && event.players && event.players.length > 0) {
                const p1 = event.players[0] || {};
                const p2 = event.players[1] || {};
                matches = [{
                    _id: event._id,
                    players: [p1, p2]
                }];
            }
            
            return {
                id: event._id || index + 1,
                image: event.image || null,
                name: event.title,
                place: event.venue?.split(',').slice(1).join(',').trim() || "TBD",
                time: formattedDate.time,
                date: formattedDate.date,
                day: formattedDate.day,
                arena: event.venue?.split(',')[0] || event.venue || "TBD",
                originalEvent: { ...event, matches },
                status,
            };
        });

        return {
            liveEvents: transformed.filter(e => e.status === 'live'),
            upcomingEvents: transformed.filter(e => e.status === 'upcoming'),
            previousEvents: transformed.filter(e => e.status === 'previous'),
        };
    }, [events]);

    const toggleEvent = (id) => setOpenEventId(prev => prev === id ? null : id);

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-orange-500 overflow-x-hidden">
            <Header />

            {/* HERO */}
            <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] w-full overflow-hidden flex items-center justify-center">
                <motion.div
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="absolute inset-0 bg-cover bg-center opacity-40 grayscale-[0.5]"
                    style={{
                        backgroundImage: `url(${heroBannerImage})`,
                        transform: "translateZ(0)"
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />
                <div className="relative z-10 text-center px-4">
                    <motion.span className="text-orange-500 font-black text-[10px] sm:text-xs uppercase mb-4 block tracking-[0.3em]">
                        World Tour 2026
                    </motion.span>
                    <motion.h1 className="text-4xl sm:text-6xl md:text-[100px] lg:text-[120px] font-[1000] italic uppercase leading-[0.8] tracking-tighter">
                        ALL <span className="text-orange-500">EVENTS</span>
                    </motion.h1>
                </div>
            </div>

            {/* CONTENT */}
            <div className="relative z-20 -mt-10 sm:-mt-20">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex gap-10 items-start">

                        {/* LEFT SIDEBAR */}
                        <aside className="hidden xl:block w-72 flex-shrink-0 sticky top-24 h-[85vh] overflow-hidden">
                            <div className="absolute inset-0 bg-orange-600/5 blur-[100px] -z-10" />
                            <BannerColumn direction="up" images={dynamicBanners} duration={40} />
                        </aside>

                        {/* EVENT LISTS */}
                        <div className="flex-1 pb-32 space-y-16">

                            {loading && (!events || events.length === 0) ? (
                                <div className="flex justify-center py-20">
                                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <>
                                    {liveEvents.length > 0 && (
                                        <section>
                                            <SectionHeader
                                                label="LIVE NOW"
                                                accent="red"
                                                icon={<FaCircle className="text-red-500 animate-pulse text-xs" />}
                                            />
                                            <div className="space-y-6 mt-6">
                                                {liveEvents.map((event) => (
                                                    <EventTicket
                                                        key={event.id}
                                                        event={event}
                                                        isOpen={openEventId === event.id}
                                                        onToggle={() => toggleEvent(event.id)}
                                                        status="live"
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {upcomingEvents.length > 0 && (
                                        <section>
                                            <SectionHeader label="UPCOMING EVENTS" accent="orange" />
                                            <div className="space-y-6 mt-6">
                                                {upcomingEvents.map((event) => (
                                                    <EventTicket
                                                        key={event.id}
                                                        event={event}
                                                        isOpen={openEventId === event.id}
                                                        onToggle={() => toggleEvent(event.id)}
                                                        status="upcoming"
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {previousEvents.length > 0 && (
                                        <section>
                                            <SectionHeader label="PREVIOUS MATCHES" accent="neutral" />
                                            <div className="space-y-6 mt-6">
                                                {previousEvents.map((event) => (
                                                    <EventTicket
                                                        key={event.id}
                                                        event={event}
                                                        isOpen={openEventId === event.id}
                                                        onToggle={() => toggleEvent(event.id)}
                                                        status="previous"
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {!loading && liveEvents.length === 0 && upcomingEvents.length === 0 && previousEvents.length === 0 && (
                                        <div className="text-center py-20 text-white/30 font-black uppercase tracking-widest text-sm">
                                            No Events Found
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <aside className="hidden xl:block w-72 flex-shrink-0 sticky top-24 h-[85vh] overflow-hidden">
                            <div className="absolute inset-0 bg-orange-600/5 blur-[100px] -z-10" />
                            <BannerColumn direction="down" images={dynamicBanners} duration={45} />
                        </aside>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const accentMap = {
    red: { bar: 'bg-red-500', text: 'text-red-500' },
    orange: { bar: 'bg-orange-500', text: 'text-orange-500' },
    neutral: { bar: 'bg-white/20', text: 'text-white/40' },
};

const SectionHeader = ({ label, accent, icon }) => {
    const { bar, text } = accentMap[accent] || accentMap.orange;
    return (
        <div className="flex items-center gap-4">
            <div className={`h-1 w-10 rounded-full ${bar}`} />
            <span className={`text-[11px] font-black uppercase tracking-[0.35em] ${text} flex items-center gap-2`}>
                {icon} {label}
            </span>
            <div className={`flex-1 h-px ${bar} opacity-20`} />
        </div>
    );
};

// ─── Event Ticket Card ────────────────────────────────────────────────────────
const EventTicket = ({ event, isOpen, onToggle, status }) => {
    const eventMatches = useMemo(() => {
        const matches = event.originalEvent?.matches || [];
        
        if (matches.length > 0) {
            return matches.map((m, idx) => {
                let p1 = {};
                let p2 = {};
                
                if (m.players && m.players.length >= 2) {
                    p1 = m.players[0] || {};
                    p2 = m.players[1] || {};
                } else if (m.player1 && m.player2) {
                    p1 = m.player1 || {};
                    p2 = m.player2 || {};
                } else if (m.p1 && m.p2) {
                    p1 = m.p1 || {};
                    p2 = m.p2 || {};
                } else {
                    p1 = m.playerOne || m.wrestler1 || {};
                    p2 = m.playerTwo || m.wrestler2 || {};
                }
                
                const p1Image = p1.image
                    ? (p1.image.startsWith('http') ? p1.image : getFullImageUrl(p1.image))
                    : fallbackImages[idx * 2 % fallbackImages.length];
                const p2Image = p2.image
                    ? (p2.image.startsWith('http') ? p2.image : getFullImageUrl(p2.image))
                    : fallbackImages[(idx * 2 + 1) % fallbackImages.length];
                
                return { 
                    p1: p1.ringName || p1.name || "TBD", 
                    p2: p2.ringName || p2.name || "TBD", 
                    img1: p1Image, 
                    img2: p2Image, 
                    matchId: m._id || event.id,
                    p1Id: p1._id,
                    p2Id: p2._id
                };
            });
        }
        return [];
    }, [event]);

    const eventImage = useMemo(() => {
        if (!event.image) return img6;
        return event.image.startsWith('http') ? event.image : getFullImageUrl(event.image);
    }, [event.image]);

    const statusBadge = {
        live: <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest bg-red-600 text-white px-3 py-1 rounded-full"><FaCircle className="text-[6px] animate-pulse" /> Live</span>,
        upcoming: <span className="text-[9px] font-black uppercase tracking-widest bg-orange-600/20 text-orange-400 px-3 py-1 rounded-full">Upcoming</span>,
        previous: <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 text-white/40 px-3 py-1 rounded-full">Ended</span>,
    }[status];

    const borderClass = {
        live: 'border border-red-500/40',
        upcoming: 'border border-white/5',
        previous: 'border border-white/5 opacity-70',
    }[status];

    const hasMatches = eventMatches.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden transition-all duration-500 ${isOpen ? 'bg-white text-black' : `bg-neutral-900 ${borderClass}`
                }`}
        >
            <div className="flex flex-col lg:flex-row items-stretch cursor-pointer" onClick={onToggle}>
                {/* DATE STUB */}
                <div className={`flex lg:flex-col items-center justify-between lg:justify-center lg:w-40 p-5 lg:p-8 border-b lg:border-b-0 lg:border-r border-dashed ${isOpen ? 'border-neutral-300' : 'border-white/10'
                    }`}>
                    <div className="flex flex-col items-start lg:items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{event.day}</span>
                        <span className={`text-3xl lg:text-4xl font-black italic leading-none my-1 ${isOpen ? 'text-orange-600' : status === 'live' ? 'text-red-400' : 'text-white'}`}>
                            {event.date.split(' ')[1] || event.date}
                        </span>
                        <span className="text-xs lg:text-sm font-bold uppercase">{event.date.split(' ')[0] || ''}</span>
                    </div>
                    <div className="lg:hidden">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${isOpen ? 'bg-black text-white' : 'bg-white/10 text-white'}`}>
                            {event.time}
                        </span>
                    </div>
                </div>

                {/* MAIN INFO */}
                <div className="flex-1 p-6 lg:p-8 relative">
                    {/* Desktop */}
                    <div className="hidden lg:flex lg:flex-row items-start relative">
                        <div className="flex-1">
                            <div className="ml-4 w-full">
                                <div className="flex items-center justify-center rounded-2xl border-4 border-white/20 bg-white/5 shadow-lg overflow-hidden">
                                    <img
                                        src={eventImage}
                                        className="w-full h-full object-contain object-center rounded-xl"
                                        alt="Event"
                                        onError={(e) => {
                                            e.target.src = img6;
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-2">
                                <h3 className={`text-3xl font-[1000] italic uppercase tracking-tighter ${isOpen ? 'text-orange-600' : 'text-white'}`}>
                                    {event.name}
                                </h3>
                                {statusBadge}
                            </div>
                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest opacity-60">
                                <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-orange-500" /> {event.arena}</span>
                                <span className="flex items-center gap-2"><FaTicketAlt className="text-orange-500" /> {event.place}</span>
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-wider opacity-70 bg-black/70 text-white rounded-full px-3 py-1 mt-2 inline-block shadow-md border border-white/10">
                                {event.time}
                            </span>
                        </div>
                        <div className="ml-auto pl-10 flex items-center">
                            <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${isOpen ? 'bg-black text-white border-black' : 'border-white/20 text-white'
                                    }`}
                            >
                                <IoIosArrowDown size={20} className="scale-125" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="lg:hidden">
                        <div className="flex flex-col">
                            <div className="w-full mb-4">
                                <div className="flex items-center justify-center rounded-2xl border-4 border-white/20 bg-white/5 shadow-lg overflow-hidden">
                                    <img
                                        src={eventImage}
                                        className="w-full h-full object-contain object-center rounded-xl"
                                        alt="Event"
                                        onError={(e) => {
                                            e.target.src = img6;
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-2">
                                <h3 className={`text-xl sm:text-2xl font-[1000] italic uppercase tracking-tighter ${isOpen ? 'text-orange-600' : 'text-white'}`}>
                                    {event.name}
                                </h3>
                                {statusBadge}
                            </div>

                            <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest opacity-60">
                                <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-orange-500" /> {event.arena}</span>
                                <span className="flex items-center gap-2"><FaTicketAlt className="text-orange-500" /> {event.place}</span>
                            </div>

                            <span className="text-[10px] font-black uppercase tracking-wider opacity-70 bg-black/70 text-white rounded-full px-3 py-1 mt-2 inline-block shadow-md border border-white/10">
                                {event.time}
                            </span>

                            <div className="flex justify-end mt-4">
                                <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all ${isOpen ? 'bg-black text-white border-black' : 'border-white/20 text-white'
                                        }`}
                                >
                                    <IoIosArrowDown size={18} />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FIGHT CARD EXPAND */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="bg-neutral-100 overflow-hidden"
                    >
                        <div className="p-5 lg:p-8 space-y-4">
                            <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-[.3em] mb-4">
                                {status === 'previous' ? 'Match Results' : 'Confirmed Matchups'}
                            </h4>
                            {hasMatches ? (
                                <div className="grid gap-3">
                                    {eventMatches.map((match, i) => (
                                        <Link
                                            key={i}
                                            to={`/events/upcoming_match/${match.matchId}`}
                                            className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl flex items-center justify-between shadow-sm border border-neutral-200 hover:border-orange-500 transition-all"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <img 
                                                    src={match.img1} 
                                                    className="w-8 h-8 lg:w-12 lg:h-12 rounded-full border border-orange-500 object-cover" 
                                                    alt={match.p1} 
                                                    onError={(e) => { e.target.src = img1; }} 
                                                />
                                                <span className="font-black italic uppercase text-[10px] lg:text-sm">{match.p1}</span>
                                            </div>
                                            <span className={`font-black italic px-4 text-xs ${status === 'previous' ? 'text-neutral-400' : 'text-orange-500'}`}>
                                                {status === 'live' ? '🔴 VS' : 'VS'}
                                            </span>
                                            <div className="flex items-center gap-3 flex-1 justify-end">
                                                <span className="font-black italic uppercase text-[10px] lg:text-sm text-right">{match.p2}</span>
                                                <img 
                                                    src={match.img2} 
                                                    className="w-8 h-8 lg:w-12 lg:h-12 rounded-full border border-neutral-300 object-cover" 
                                                    alt={match.p2} 
                                                    onError={(e) => { e.target.src = img2; }} 
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-neutral-400 text-sm">
                                    No matches confirmed yet
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── Banner Column ────────────────────────────────────────────────────────────
const BannerColumn = ({ direction, images, duration }) => {
    // Ensure we have enough images for smooth scrolling
    const displayImages = useMemo(() => {
        if (!images || images.length === 0) {
            return [...banners, ...banners];
        }
        // Duplicate images to ensure seamless scrolling
        return [...images, ...images];
    }, [images]);

    return (
        <div className="w-full h-full relative rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden">
            <motion.div
                className="flex flex-col gap-4 p-4"
                animate={{ y: direction === 'up' ? [0, "-50%"] : ["-50%", 0] }}
                transition={{ duration, ease: "linear", repeat: Infinity }}
            >
                {displayImages.map((img, index) => (
                    <div key={index} className="w-full h-64 rounded-2xl overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 flex-shrink-0">
                        <img 
                            src={img} 
                            alt={`Player ${index + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = banners[index % banners.length];
                            }}
                        />
                    </div>
                ))}
            </motion.div>
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505] to-transparent z-10" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
        </div>
    );
};

export default Event;