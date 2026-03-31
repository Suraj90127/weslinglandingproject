import React, { useState, useEffect } from 'react'
import Header from '../Compontnts/Header'
import Footer from '../Compontnts/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaTrophy, FaUserFriends, FaStar, FaMedal, FaBolt, FaFlag, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { fetchPlayers } from '../redux/slices/playerSlice';
import { useDispatch, useSelector } from 'react-redux';

const Wrestlers = () => {

    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const limit = 12;

    const dispatch = useDispatch();

    const { players, loading: playersLoading, totalPlayers } = useSelector((state) => state.players);

    const totalPages = Math.ceil((totalPlayers || 0) / limit) || 1;

    useEffect(() => {
        dispatch(fetchPlayers({ page, limit }));
    }, [dispatch, page]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const transformedPlayers = players?.map((player, index) => {

        let category = "All";
        const totalScore = player.matchesWon || 0;

        if (totalScore > 50) {
            category = "Champions";
        }
        else if (totalScore > 20) {
            category = "Rising Stars";
        }
        else {
            category = "Legends";
        }

        return {
            id: player._id || index,
            name: player.name || "Unknown Player",
            image: player.image || "https://via.placeholder.com/600x600?text=No+Image",
            title: player.profession || "Wrestler",
            category: category,
            ringName: player.ringName,
            nativePlace: player.nativePlace,
            age: player.age,
            height: player.height,
            weight: player.weight,
            chest: player.chest,
            biceps: player.biceps,
            isActive: player.isActive,
            matchesWon: player.matchesWon || 0,
            socialMedia: player.socialMedia || { instagram: "", facebook: "", youtube: "" },
            contact: player.contact || { phone: "N/A", email: "N/A", address: "N/A" }
        };

    }) || [];


    const categories = [
        { name: "All", icon: <FaUserFriends /> },
        { name: "Champions", icon: <FaTrophy /> },
        { name: "Legends", icon: <FaStar /> },
        { name: "Rising Stars", icon: <FaMedal /> }
    ];


    const filteredWrestlers = transformedPlayers.filter((wrestler) => {

        const matchesCategory =
            activeCategory === "All" || wrestler.category === activeCategory;

        const searchLower = searchQuery.toLowerCase();

        const matchesSearch =
            (wrestler.name || "").toLowerCase().includes(searchLower) ||
            (wrestler.title || "").toLowerCase().includes(searchLower) ||
            (wrestler.nativePlace || "").toLowerCase().includes(searchLower) ||
            (wrestler.ringName || "").toLowerCase().includes(searchLower);

        return matchesCategory && matchesSearch;

    });

    if (playersLoading) {
        return (
            <div className="bg-[#050505] min-h-screen text-white flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-20 w-20 sm:h-32 sm:w-32 border-t-2 border-b-2 border-orange-500 mx-auto mb-8"></div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest">
                        Loading Warriors...
                    </h2>
                </div>
            </div>
        );
    }

    return (

        <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden">

            <Header />

            <div className="pt-24 sm:pt-32 pb-20 container mx-auto px-4 sm:px-6">

                {/* HEADER */}
                <div className="text-center mb-10 sm:mb-16">

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-8xl font-[1000] italic uppercase tracking-tighter mb-6 sm:mb-8"
                    >
                        THE <span className="text-orange-500">wrestlers</span>
                    </motion.h1>


                    <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 max-w-5xl mx-auto">

                        {/* SEARCH */}
                        <div className="relative w-full lg:w-96">

                            <input
                                type="text"
                                placeholder="FIND YOUR WARRIOR..."
                                className="w-full bg-neutral-900 border-2 border-white/5 text-white px-5 py-4 rounded-xl sm:rounded-2xl focus:outline-none focus:border-orange-600 transition-all pl-12 font-bold uppercase tracking-widest text-[10px] sm:text-xs"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" />

                        </div>

                        {/* CATEGORY FILTER */}
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">

                            {categories.map((cat) => (

                                <button
                                    key={cat.name}
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={`px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[9px] sm:text-[10px] flex items-center gap-2 sm:gap-3 transition-all ${activeCategory === cat.name
                                        ? "bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] scale-105"
                                        : "bg-neutral-900 text-neutral-500 hover:bg-neutral-800 hover:text-white"
                                        }`}
                                >

                                    {cat.icon}
                                    {cat.name}

                                </button>

                            ))}

                        </div>

                    </div>

                </div>


                {/* WRESTLER GRID */}

                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

                    <AnimatePresence mode='popLayout'>

                        {filteredWrestlers.map((warrior) => (

                            <Link to={`/wrestlers/${warrior.id}`} key={warrior.id}>

                                <motion.div

                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -12 }}
                                    className="group relative h-[520px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-neutral-900"

                                >

                                    <img
                                        src={warrior.image}
                                        alt={warrior.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100" />

                                    <div className="absolute bottom-0 p-8 transform translate-y-24 group-hover:translate-y-0 transition-transform duration-500">

                                        <div className="flex items-center gap-2 mb-2">
                                            <FaBolt className="text-orange-500 text-xs" />
                                            <p className="text-orange-500 font-black uppercase text-[10px] tracking-[.3em]">
                                                {warrior.title}
                                            </p>
                                        </div>

                                        <h2 className="text-3xl font-[1000] text-white uppercase italic mb-2">
                                            {warrior.name}
                                        </h2>

                                        <div className="flex flex-wrap gap-2 mb-4 text-xs text-neutral-400">

                                            {warrior.ringName &&
                                                <span className="bg-white/10 px-2 py-1 rounded-full">
                                                    AKA {warrior.ringName}
                                                </span>
                                            }

                                            {warrior.nativePlace &&
                                                <span className="bg-white/10 px-2 py-1 rounded-full flex items-center gap-1">
                                                    <FaFlag className="text-orange-500" />
                                                    {warrior.nativePlace}
                                                </span>
                                            }

                                        </div>


                                        {/* BASIC STATS */}

                                        <div className="grid grid-cols-3 gap-2 mb-4">

                                            <div className="bg-white/5 rounded-xl p-2 text-center">
                                                <p className="text-[8px] font-black text-neutral-400 uppercase">Wins</p>
                                                <p className="text-lg font-black text-orange-500">{warrior.matchesWon}</p>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-2 text-center">
                                                <p className="text-[8px] font-black text-neutral-400 uppercase">Height</p>
                                                <p className="text-lg font-black text-green-500">{warrior.height || "-"}</p>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-2 text-center">
                                                <p className="text-[8px] font-black text-neutral-400 uppercase">Weight</p>
                                                <p className="text-lg font-black text-blue-500">{warrior.weight || "-"}</p>
                                            </div>

                                        </div>


                                        {/* CHEST + BICEPS */}

                                        <div className="grid grid-cols-2 gap-2">

                                            <div className="bg-white/5 rounded-xl p-2 text-center">
                                                <p className="text-[8px] font-black text-neutral-400 uppercase">Chest</p>
                                                <p className="text-lg font-black text-red-500">{warrior.chest || "-"}</p>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-2 text-center">
                                                <p className="text-[8px] font-black text-neutral-400 uppercase">Biceps</p>
                                                <p className="text-lg font-black text-purple-500">{warrior.biceps || "-"}</p>
                                            </div>

                                        </div>

                                    </div>


                                    <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">
                                            {warrior.category}
                                        </span>
                                    </div>

                                </motion.div>

                            </Link>

                        ))}

                    </AnimatePresence>

                </motion.div>


                {filteredWrestlers.length === 0 && (

                    <div className="py-40 text-center">

                        <h3 className="text-2xl font-black uppercase text-neutral-700 italic">
                            No Warriors match your search
                        </h3>

                    </div>

                )}

            </div>

            <Footer />

        </div>

    )
}

export default Wrestlers;