import React, { lazy, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';

import { fetchBanners } from '../redux/slices/bannerSlice';
import { fetchEvents } from '../redux/slices/eventSlice';
import { fetchPlayers } from '../redux/slices/playerSlice';
import { fetchAllContent } from '../redux/slices/contentSlice';

// Lazy load Components
const Navbar = lazy(() => import('../Compontnts/Header'));
const Hero = lazy(() => import('../Compontnts/Hero'));
const Games = lazy(() => import('../Compontnts/Games'));
const TrendingGames = lazy(() => import('../Compontnts/TrendingGames'));
const Tournaments = lazy(() => import('../Compontnts/Tournaments'));
// Removed LightScene
const WrestlingHUb = lazy(() => import('../Compontnts/WrestlingHub'));
const JoinUs = lazy(() => import('../Compontnts/JoinUs'));
const Footer = lazy(() => import('../Compontnts/Footer'));

// A sleek loading fallback to keep users engaged
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
    <div className="loader"></div>
  </div>
);

const HomePage = () => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const { banners, loading: bannersLoading } = useSelector((state) => state.banners);
  const { events, upcomingEvents, loading: eventsLoading } = useSelector((state) => state.events);
  const { players, stats: playerStats, loading: playersLoading } = useSelector((state) => state.players);
  const { contents, loading: contentLoading } = useSelector((state) => state.contents);

  useEffect(() => {
    // Fetch data with limits for better performance
    dispatch(fetchBanners({ limit: 10 }));
    dispatch(fetchEvents({ limit: 10 }));
    dispatch(fetchPlayers({ limit: 20 })); // Fetch enough for shuffling in Games
    dispatch(fetchAllContent({ limit: 5 }));
  }, [dispatch]);





  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#050505]"
      >
        <Navbar />

        <Hero />

        <section className="space-y-0">
          <Games />
          <TrendingGames />
          <Tournaments />
          {/* Removed LightScene */}
          <WrestlingHUb />
          <JoinUs />
        </section>

        <Footer />
      </motion.div>
    </Suspense>
  );
};

export default HomePage;