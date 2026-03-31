import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Compontnts/Header';
import Footer from '../Compontnts/Footer';
import { motion } from 'framer-motion';
import {
    FaUserAlt, FaMapMarkerAlt, FaMedal, FaInstagram,
    FaFacebook, FaYoutube, FaArrowLeft, FaRulerVertical,
    FaWeightHanging, FaPhone, FaEnvelope, FaHome
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlayerById } from '../redux/slices/playerSlice';

const WrestlerDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedPlayer: player, loading } = useSelector((state) => state.players);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (id) {
            dispatch(fetchPlayerById(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="bg-[#050505] min-h-screen text-white flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-20 w-20 sm:h-32 sm:w-32 border-t-2 border-b-2 border-orange-500 mx-auto mb-8" />
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest">Loading Warrior Data...</h2>
                </div>
            </div>
        );
    }

    if (!player) {
        return (
            <div className="h-screen bg-black flex items-center justify-center px-6 text-center">
                <div>
                    <h2 className="text-3xl font-black uppercase italic text-white/40">Warrior Not Found</h2>
                    <Link to="/wrestlers" className="mt-6 inline-block text-orange-600 font-bold uppercase tracking-widest text-xs border-b border-orange-600 pb-1">
                        Return to wrestlers
                    </Link>
                </div>
            </div>
        );
    }

    const { name, ringName, nativePlace, profession, height, weight, chest, biceps, age, matchesWon, socialMedia, contact, image } = player;

    // Check for non-empty social media links
    const instagram = socialMedia?.instagram?.trim();
    const facebook = socialMedia?.facebook?.trim();
    const youtube = socialMedia?.youtube?.trim();
    const hasSocial = instagram || facebook || youtube;

    // Check for non-empty contact info
    const phone = contact?.phone?.trim();
    const email = contact?.email?.trim();
    const address = contact?.address?.trim();
    const hasContact = phone || email || address;

    const fallbackImage = "https://via.placeholder.com/600x600?text=No+Image";

    return (
        <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-orange-600">
            <Header />

            {/* Back Button */}
            <div className="pt-24 sm:pt-32 container mx-auto px-4 sm:px-6 mb-4">
                <Link
                    to="/wrestlers"
                    className="inline-flex items-center text-orange-500 hover:text-white transition-colors uppercase tracking-widest text-[10px] sm:text-xs font-black"
                >
                    <FaArrowLeft className="mr-2" /> Back to wrestlers
                </Link>
            </div>

            <div className="container mx-auto max-w-6xl px-4 sm:px-6 pb-20">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

                    {/* LEFT — Player Photo */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="w-full lg:w-2/5 sticky top-28"
                    >
                        <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-white/10 group aspect-[4/5] bg-neutral-900">
                            <img
                                src={image || fallbackImage}
                                alt={name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                onError={(e) => { e.target.src = fallbackImage; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-20">
                                {ringName && (
                                    <span className="bg-orange-600 text-white text-[10px] font-black italic uppercase px-3 py-1 rounded-full tracking-widest mb-2 inline-block">
                                        AKA {ringName}
                                    </span>
                                )}
                                <h1 className="text-4xl sm:text-6xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-none text-white drop-shadow-lg">
                                    {name}
                                </h1>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT — Details */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="w-full lg:w-3/5 flex flex-col justify-start space-y-8 lg:pt-4"
                    >
                        {/* Profile Label */}
                        <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-orange-500">
                            Warrior Profile
                        </h3>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <InfoBlock icon={<FaUserAlt />} label="Profession" value={profession || "Wrestler"} />
                            <InfoBlock icon={<FaMapMarkerAlt />} label="Native Place" value={nativePlace || "Unknown"} />
                            <InfoBlock icon={<FaRulerVertical />} label="Height" value={height || "N/A"} />
                            <InfoBlock icon={<FaWeightHanging />} label="Weight" value={weight || "N/A"} />
                            <InfoBlock icon={<FaMedal />} label="Matches Won" value={matchesWon ?? 0} highlight />
                            <InfoBlock label="Age" value={age ? `${age} Years` : "Unknown"} />
                            {chest && <InfoBlock label="Chest" value={chest} />}
                            {biceps && <InfoBlock label="Biceps" value={biceps} />}
                        </div>

                        {/* Social Media Links */}
                        {hasSocial ? (
                            <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-[1.5rem] border border-white/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-5">
                                    Connect with {name}
                                </h4>
                                <div className="flex flex-wrap gap-4">
                                    {instagram && (
                                        <a
                                            href={instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 bg-white/10 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 px-5 py-3 rounded-xl transition-all text-neutral-300 hover:text-white font-bold text-sm uppercase tracking-widest"
                                        >
                                            <FaInstagram size={20} />
                                            <span className="hidden sm:inline">Instagram</span>
                                        </a>
                                    )}
                                    {facebook && (
                                        <a
                                            href={facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 bg-white/10 hover:bg-blue-600 px-5 py-3 rounded-xl transition-all text-neutral-300 hover:text-white font-bold text-sm uppercase tracking-widest"
                                        >
                                            <FaFacebook size={20} />
                                            <span className="hidden sm:inline">Facebook</span>
                                        </a>
                                    )}
                                    {youtube && (
                                        <a
                                            href={youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 bg-white/10 hover:bg-red-600 px-5 py-3 rounded-xl transition-all text-neutral-300 hover:text-white font-bold text-sm uppercase tracking-widest"
                                        >
                                            <FaYoutube size={20} />
                                            <span className="hidden sm:inline">YouTube</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {/* Contact Information */}
                        {/* {hasContact && (
                            <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-[1.5rem] border border-white/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-5">
                                    Contact
                                </h4>
                                <div className="space-y-4">
                                    {phone && (
                                        <a
                                            href={`tel:${phone}`}
                                            className="flex items-center gap-4 text-neutral-300 hover:text-orange-400 transition-colors group"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-orange-600/20 transition-colors">
                                                <FaPhone size={16} className="text-orange-500" />
                                            </div>
                                            <span className="text-sm font-medium">{phone}</span>
                                        </a>
                                    )}
                                    {email && (
                                        <a
                                            href={`mailto:${email}`}
                                            className="flex items-center gap-4 text-neutral-300 hover:text-orange-400 transition-colors group"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-orange-600/20 transition-colors">
                                                <FaEnvelope size={16} className="text-orange-500" />
                                            </div>
                                            <span className="text-sm font-medium">{email}</span>
                                        </a>
                                    )}
                                    {address && (
                                        <div className="flex items-start gap-4 text-neutral-300">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 flex-shrink-0">
                                                <FaHome size={16} className="text-orange-500" />
                                            </div>
                                            <span className="text-sm font-medium leading-relaxed">{address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )} */}

                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const InfoBlock = ({ icon, label, value, highlight }) => (
    <div className={`p-4 sm:p-6 rounded-[1.5rem] border ${highlight ? 'bg-orange-600/10 border-orange-500/20' : 'bg-neutral-900 border-white/5'}`}>
        <div className="flex items-center gap-2 mb-2">
            {icon && (
                <div className={`${highlight ? 'text-orange-500' : 'text-neutral-500'} text-sm`}>
                    {icon}
                </div>
            )}
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-neutral-500">
                {label}
            </span>
        </div>
        <p className={`text-lg sm:text-2xl font-black uppercase italic truncate ${highlight ? 'text-orange-500' : 'text-white'}`}>
            {value}
        </p>
    </div>
);

export default WrestlerDetail;
