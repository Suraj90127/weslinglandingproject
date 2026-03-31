import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "./Compontnts/Layout";
import ErrorBoundary from './Compontnts/ErrorBoundary';

/* =========================
   LAZY PAGE IMPORTS WITH ERROR HANDLING
========================= */
const HomePage = lazy(() =>
  import("./Pages/HomePage").catch(err => {
    console.error("Failed to load HomePage:", err);
    return { default: () => <div>Error loading HomePage</div> };
  })
);

const About = lazy(() =>
  import("./Pages/About").catch(err => {
    console.error("Failed to load About:", err);
    return { default: () => <div>Error loading About</div> };
  })
);

const Event = lazy(() =>
  import("./Pages/Event").catch(err => {
    console.error("Failed to load Event:", err);
    return { default: () => <div>Error loading Event</div> };
  })
);

const ContactUs = lazy(() =>
  import("./Pages/ContactUs").catch(err => {
    console.error("Failed to load ContactUs:", err);
    return { default: () => <div>Error loading ContactUs</div> };
  })
);

const Wrestlers = lazy(() =>
  import("./Pages/Wrestlers").catch(err => {
    console.error("Failed to load Wrestlers:", err);
    return { default: () => <div>Error loading Wrestlers</div> };
  })
);

const WrestlerDetail = lazy(() =>
  import("./Pages/WrestlerDetail").catch(err => {
    console.error("Failed to load WrestlerDetail:", err);
    return { default: () => <div>Error loading WrestlerDetail</div> };
  })
);

const MatchDetail = lazy(() =>
  import("./Pages/MatchDetail").catch(err => {
    console.error("Failed to load MatchDetail:", err);
    return { default: () => <div>Error loading MatchDetail</div> };
  })
);

const Gallary = lazy(() =>
  import("./Pages/Gallary").catch(err => {
    console.error("Failed to load Gallary:", err);
    return { default: () => <div>Error loading Gallary</div> };
  })
);

const GallaryDetail = lazy(() =>
  import("./Pages/GallaryDetails").catch(err => {
    console.error("Failed to load GallaryDetail:", err);
    return { default: () => <div>Error loading GallaryDetail</div> };
  })
);

/* =========================
   PREMIUM LOADER (AWE Style)
========================= */
const Loader = () => (
  <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col justify-center items-center z-[999]">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      className="relative"
    >
      <div className="w-24 h-24 rounded-full border-t-4 border-orange-600 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-black italic tracking-tighter text-xl">AWE</span>
      </div>
    </motion.div>
    <motion.p
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="mt-6 text-orange-500 font-black text-[10px] uppercase tracking-[0.5em]"
    >
      Entering Arena...
    </motion.p>
  </div>
);

/* =========================
   PAGE WRAPPER (For Transitions)
========================= */
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

/* =========================
   APP MAIN
========================= */
function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ErrorBoundary> {/* Wrap everything in ErrorBoundary */}
      <Suspense fallback={<Loader />}>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

              <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/events" element={<PageWrapper><Event /></PageWrapper>} />
              <Route path="/contact_us" element={<PageWrapper><ContactUs /></PageWrapper>} />
              <Route path="/wrestlers" element={<PageWrapper><Wrestlers /></PageWrapper>} />
              <Route path="/wrestlers/:id" element={<PageWrapper><WrestlerDetail /></PageWrapper>} />
              <Route path="/gallery" element={<PageWrapper><Gallary /></PageWrapper>} />
              <Route path="/gallery/:id" element={<PageWrapper><GallaryDetail /></PageWrapper>} />
              <Route path="/events/upcoming_match/:Id" element={<PageWrapper><MatchDetail /></PageWrapper>} />



              <Route path="*" element={
                <PageWrapper>
                  <div className="h-screen bg-black flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-9xl font-[1000] italic text-white/10 absolute">404</h1>
                    <h2 className="text-4xl font-black text-white relative">ARENA NOT FOUND</h2>
                    <p className="text-neutral-500 mt-4 mb-8">You've wandered outside the ring, champion.</p>
                    <a href="/" className="px-8 py-4 bg-orange-600 text-white font-black rounded-full uppercase text-xs tracking-widest">
                      Return Home
                    </a>
                  </div>
                </PageWrapper>
              } />

            </Routes>
          </AnimatePresence>
        </Layout>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

