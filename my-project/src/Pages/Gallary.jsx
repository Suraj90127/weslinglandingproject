import React, { useEffect } from 'react';
import Header from '../Compontnts/Header';
import Footer from '../Compontnts/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCamera, FaArrowRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../redux/slices/bannerSlice';
import { host as API_BASE_URL } from '../redux/api';
import { useState } from 'react';

const Gallery = () => {
    const dispatch = useDispatch();
    const { banners, loading: bannersLoading, totalBanners } = useSelector((state) => state.banners);
    const galleries = banners?.filter(item => item.pageType === "gallery") || [];

    // Pagination state
    const [page, setPage] = useState(1);
    const limit = 12;
    // Calculate total pages for gallery exactly. We can't know precisely how many galleries exist overall vs banners without a specific backend endpoint.
    // However, since we filter them here, the UI paging is an approximation. Let's use the total returned if available.
    const totalPages = Math.ceil((totalBanners || 0) / limit) || 1;

    useEffect(() => {
        dispatch(fetchBanners({ limit, page }));
    }, [dispatch, page]);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden">
            <Header />

            {/* HERO SECTION - Responsive Padding & Text */}
            <div className="pt-32 sm:pt-40 pb-12 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] sm:h-[500px] bg-orange-600/10 blur-[80px] sm:blur-[120px] rounded-full -z-10" />
                <div className="container mx-auto text-center">
                    <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-orange-500 font-black tracking-[.3em] sm:tracking-[.4em] uppercase text-[10px] sm:text-xs mb-4 block"
                    >
                        The Visual Archive
                    </motion.span>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        // text-5xl for mobile, text-8xl for desktop
                        className="text-5xl md:text-8xl font-[1000] italic uppercase leading-none tracking-tighter mb-6"
                    >
                        PHOTO <span className="text-orange-500">GALLERY</span>
                    </motion.h1>
                    <p className="text-neutral-400 text-sm sm:text-lg max-w-2xl mx-auto font-medium px-4">
                        High-definition captures of every bone-crushing strike and championship glory.
                    </p>
                </div>
            </div>

            {/* LOADING STATE - Skeleton Grid */}
            {bannersLoading && (
                <div className="container mx-auto px-4 sm:px-6 pb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-square sm:aspect-[4/5] rounded-[1.5rem] sm:rounded-[2rem] bg-neutral-900 animate-pulse border border-white/5" />
                        ))}
                    </div>
                </div>
            )}

            {/* NO GALLERIES FOUND */}
            {!bannersLoading && galleries.length === 0 && (
                <div className="container mx-auto px-6 pb-32 text-center">
                    <p className="text-neutral-600 font-black italic uppercase text-xl">No galleries found in the archive.</p>
                </div>
            )}

            {/* ALBUM GRID - Adjusted gap and aspect ratio for mobile */}
            {!bannersLoading && galleries.length > 0 && (
                <div className="container mx-auto px-4 sm:px-6 pb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {galleries.map((album, index) => (
                            <motion.div
                                key={album._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <Link to={`/gallery/${album._id}`}>
                                    {/* aspect-square on mobile for better thumb reach, aspect-[4/5] on desktop */}
                                    <div className="relative aspect-square sm:aspect-[4/5] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/10 group-hover:border-orange-500/50 transition-all duration-500">

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-90 group-hover:opacity-70 transition-opacity" />

                                        {/* Thumbnail Image */}
                                        <img
                                            src={album.images && album.images.length > 0
                                                ? (album.images[0].startsWith('http') ? album.images[0] : `${API_BASE_URL}${album.images[0]}`)
                                                : '/placeholder-image.jpg'
                                            }
                                            alt={album.title || album.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                            onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                        />

                                        {/* Count Badge - Smaller on mobile */}
                                        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 bg-orange-600 text-white text-[8px] sm:text-[10px] font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 shadow-xl">
                                            <FaCamera /> {album.allImages?.length || album.images?.length || 0} SHOTS
                                        </div>

                                        {/* Text Content - Responsive padding and sizing */}
                                        <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-20">
                                            <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter mb-2 group-hover:text-orange-500 transition-colors leading-none">
                                                {album.title || album.name}
                                            </h3>
                                            <p className="text-neutral-400 text-[10px] sm:text-xs font-bold leading-relaxed mb-4 sm:mb-6 line-clamp-2 opacity-80">
                                                {album.description || 'Gallery collection'}
                                            </p>
                                            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[.2em] text-white/80 group-hover:text-white transition-colors">
                                                View Album <FaArrowRight className="group-hover:translate-x-2 transition-transform text-orange-500" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && !bannersLoading && (
                <div className="flex justify-center items-center space-x-4 pb-12">
                    <button
                        onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
                        disabled={page === 1}
                        className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${page === 1
                            ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                            : "bg-orange-600 text-white hover:bg-orange-500"
                            }`}
                    >
                        PREV
                    </button>
                    <span className="text-neutral-400 font-bold uppercase tracking-widest text-xs">
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}
                        disabled={page === totalPages}
                        className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${page === totalPages
                            ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                            : "bg-orange-600 text-white hover:bg-orange-500"
                            }`}
                    >
                        NEXT
                    </button>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Gallery;