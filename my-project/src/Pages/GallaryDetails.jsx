import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Compontnts/Header';
import Footer from '../Compontnts/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaArrowLeft, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../redux/slices/bannerSlice';

const GalleryDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(null);

    const { banners, loading: bannersLoading } = useSelector((state) => state.banners);
    const album = banners?.find(item => item._id === id && item.pageType === "gallery");

    useEffect(() => { window.scrollTo(0, 0); }, []);

    useEffect(() => {
        if (!banners || banners.length === 0) {
            dispatch(fetchBanners());
        }
    }, [dispatch, banners]);

    if (bannersLoading) return <LoadingState />;
    if (!album) return <AlbumNotFound />;

    const allImages = album.allImages || album.images || [];

    const navigateImage = (direction) => {
        const currentIndex = allImages.indexOf(selectedImage);
        let newIndex = (currentIndex + direction + allImages.length) % allImages.length;
        setSelectedImage(allImages[newIndex]);
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden">
            <Header />

            <div className="pt-28 sm:pt-32 pb-20 container mx-auto px-4 sm:px-6">
                {/* BACK BUTTON & HEADER */}
                <div className="mb-10 sm:mb-16">
                    <Link to="/gallery" className="flex items-center gap-2 text-neutral-500 hover:text-orange-500 font-black uppercase text-[9px] sm:text-[10px] tracking-[.3em] transition-all mb-6 sm:mb-8">
                        <FaArrowLeft /> Return to Archive
                    </Link>
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        className="text-4xl sm:text-7xl font-[1000] italic uppercase tracking-tighter leading-none"
                    >
                        {album.title || album.name}
                    </motion.h1>
                    <div className="h-1.5 w-16 sm:w-24 bg-orange-600 mt-4 rounded-full" />
                </div>

                {/* MASONRY-STYLE GRID - Optimized Columns */}
                {allImages.length > 0 ? (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
                        {allImages.map((img, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedImage(img)}
                                className="relative group cursor-pointer overflow-hidden rounded-[1.2rem] sm:rounded-[1.5rem] border border-white/5 break-inside-avoid"
                            >
                                <img
                                    src={img}
                                    alt={`Shot ${index + 1}`}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                />
                                {/* Mobile Expand Icon (Visible) vs Desktop (Hover) */}
                                <div className="absolute inset-0 bg-orange-600/20 opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-white text-black p-3 sm:p-4 rounded-full scale-75 sm:scale-100">
                                        <FaExpand />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-neutral-500 font-bold uppercase tracking-widest">
                        The archive is currently empty.
                    </div>
                )}
            </div>

            {/* CINEMATIC LIGHTBOX - Responsive Navigation */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close Button - Larger touch target */}
                        <button
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 text-white/60 hover:text-white text-2xl sm:text-3xl p-4 z-[110]"
                            onClick={() => setSelectedImage(null)}
                        >
                            <FaTimes />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-20">
                            {/* Desktop Arrows */}
                            <div className="hidden sm:block">
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
                                    className="absolute left-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:text-orange-500 hover:border-orange-500 transition-all z-[110]"
                                >
                                    <FaChevronLeft size={24} />
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
                                    className="absolute right-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:text-orange-500 hover:border-orange-500 transition-all z-[110]"
                                >
                                    <FaChevronRight size={24} />
                                </button>
                            </div>

                            <motion.img
                                key={selectedImage}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={selectedImage}
                                alt="Preview"
                                className="max-w-full max-h-[80vh] sm:max-h-full object-contain rounded-lg sm:rounded-xl shadow-2xl pointer-events-none"
                                onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                            />
                        </div>

                        {/* Mobile Navigation Bar (Bottom) */}
                        {allImages.length > 1 && (
                            <div className="sm:hidden fixed bottom-10 left-0 right-0 flex justify-center items-center gap-12 z-[110]">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
                                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
                                >
                                    <FaChevronLeft />
                                </button>
                                <span className="text-[10px] font-black tracking-widest">
                                    {allImages.indexOf(selectedImage) + 1} / {allImages.length}
                                </span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
                                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            <Footer />
        </div>
    );
};

/* LOADING & ERROR STATES */
const LoadingState = () => (
    <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
);

const AlbumNotFound = () => (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-[1000] italic uppercase text-white/20 mb-6">Archive Missing</h2>
        <Link to="/gallery" className="bg-orange-600 px-8 py-4 rounded-full text-white font-black uppercase text-xs tracking-widest hover:bg-orange-700 transition-all">
            Return to Gallery
        </Link>
    </div>
);

export default GalleryDetail;