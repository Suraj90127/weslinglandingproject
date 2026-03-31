import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaFistRaised, FaBolt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";


const Games = () => {
    const [activeId, setActiveId] = useState(null);
    const [randomPlayers, setRandomPlayers] = useState([]);

    const dispatch = useDispatch();
    const { players, loading } = useSelector((state) => state.players);



    // Shuffle & transform players
    useEffect(() => {
        if (players && players.length > 0) {
            const shuffled = [...players]
                .map((player, index) => ({
                    id: player._id || index,
                    image: player.image || "https://via.placeholder.com/400x600?text=No+Image",
                    name: player.name || "Unknown",
                    role: player.profession || "Wrestler",
                    stats: {
                        str: Math.min(100, 70 + (player.matchesWon || 0)),
                        spd: 80,
                        tec: Math.min(100, 60 + (player.matchesWon || 0)),
                    },
                }))
                .sort(() => 0.5 - Math.random()) // random
                .slice(0, 5); // show only 5

            setRandomPlayers(shuffled);
            setActiveId(shuffled[0]?.id); // default active
        }
    }, [players]);

    // Loading UI
    if (loading) {
        return (
            <section className="relative py-10 bg-neutral-950 overflow-hidden min-h-[800px] flex flex-col justify-center">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <div className="h-16 w-3/4 bg-neutral-900 animate-pulse mx-auto rounded-xl mb-4"></div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4 h-[600px] w-full max-w-7xl mx-auto">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`relative rounded-3xl overflow-hidden bg-neutral-900 animate-pulse ${i === 1 ? "flex-[3]" : "flex-[1]"}`}>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-10 bg-neutral-950 overflow-hidden min-h-[800px] flex flex-col justify-center">
            {/* Background Animation */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px]"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h1 className="font-black text-5xl md:text-7xl uppercase italic text-white">
                        Choose Your <span className="text-orange-500">Champion</span>
                    </h1>
                </div>

                {/* Cards */}
                <div className="flex flex-col lg:flex-row gap-4 h-[600px] w-full max-w-7xl mx-auto">
                    {randomPlayers.map((wrestler) => (
                        <Card
                            key={wrestler.id}
                            wrestler={wrestler}
                            isActive={activeId === wrestler.id}
                            onClick={() => setActiveId(wrestler.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const Card = ({ wrestler, isActive, onClick }) => {
    return (
        <motion.div
            layout
            onClick={onClick}
            className={`relative rounded-3xl overflow-hidden cursor-pointer group ${isActive ? "flex-[3]" : "flex-[1] hover:flex-[1.5]"
                } transition-all duration-500`}
        >
            {/* Image */}
            <img
                src={wrestler.image}
                alt={wrestler.name}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isActive ? "scale-110" : "grayscale group-hover:grayscale-0"
                    }`}
                onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x600?text=No+Image";
                }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6">
                <AnimatePresence mode="wait">
                    {isActive ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <span className="px-3 py-1 bg-orange-600 text-xs font-bold rounded-full">
                                {wrestler.role}
                            </span>

                            <h3 className="text-4xl font-black text-white mt-3">
                                {wrestler.name}
                            </h3>

                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <StatBox label="STR" value={wrestler.stats.str} />
                                <StatBox label="SPD" value={wrestler.stats.spd} />
                                <StatBox label="TEC" value={wrestler.stats.tec} />
                            </div>
                        </motion.div>
                    ) : (
                        <h3 className="text-xl text-white/60 text-center">
                            {wrestler.name}
                        </h3>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const StatBox = ({ label, value }) => (
    <div className="text-center">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-xl font-bold text-white">{value}</div>
    </div>
);

export default Games;