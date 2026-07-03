import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  FaTrophy, FaImages, FaCalendar, FaUsers, FaHome, FaEnvelope, FaPlus
} from 'react-icons/fa';
import { GiRing } from 'react-icons/gi';
import Logo from '../assets/images/Asian_Wrestling_Entertainment.png';

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const location = useLocation();

  // ONLY detect scroll for background change (NO HIDE)
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'wrestlers', path: '/wrestlers', icon: <FaTrophy /> },
    { name: 'Events', path: '/events', icon: <FaCalendar /> },
    { name: 'Gallery', path: '/gallery', icon: <FaImages /> },
    { name: 'About', path: '/about', icon: <FaUsers /> },
    { name: 'Contact', path: '/contact_us', icon: <FaEnvelope /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed w-full z-[100] transition-all duration-500 px-4 pt-4 md:pt-6"
      >
        <div className={`mx-auto transition-all duration-500 overflow-hidden ${scrolled
            ? 'max-w-4xl bg-black/60 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]'
            : 'max-w-7xl bg-transparent'
          }`}>
          <div className="flex justify-between items-center h-16 md:h-20 px-6">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group relative">
              {/* Logo Background Glow */}
              <div className="absolute inset-0 bg-orange-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <motion.div
                animate={{
                  scale: scrolled ? 0.9 : 1.1, // Scroll par chhota, normal par bada
                  rotate: scrolled ? 0 : [0, -5, 5, 0]
                }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <img
                  src={Logo}
                  alt="AWE"
                  className={`transition-all duration-500 object-contain drop-shadow-[0_0_10px_rgba(249,115,22,0.6)] ${scrolled ? 'h-12' : 'h-12 md:h-16' // Initial size kafi badi rakhi hai
                    }`}
                />
                {/* Logo Reflection Effect */}
                <div className="absolute -bottom-2 left-0 w-full h-1/2 bg-gradient-to-t from-orange-500/20 to-transparent blur-sm -z-10" />
              </motion.div>

              <div className="flex flex-col justify-center">
                <span className={`font-[1000] italic leading-none transition-all duration-500 tracking-tighter ${scrolled ? 'text-xl' : 'text-2xl'
                  }`}>
                  <span className="text-white">A</span>
                  <span className="text-orange-500">W</span>
                  <span className="text-white">E</span>
                </span>

              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2"
                >
                  <span className={`relative z-10 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${isActive(link.path) ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}>
                    {link.name}
                  </span>

                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full -z-0 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            >
              <div className="w-6 h-0.5 bg-orange-500 rounded-full" />
              <div className="w-4 h-0.5 bg-white rounded-full self-end" />
              <div className="w-6 h-0.5 bg-orange-500 rounded-full" />
            </motion.button>

          </div>
        </div>
      </motion.nav>


      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl md:hidden"
          >

            {/* Close */}
            <motion.button
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"
            >
              <FaPlus className="rotate-45 text-2xl" />
            </motion.button>

            {/* Links */}
            <div className="h-full flex flex-col justify-center px-10">
              <div className="space-y-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-end gap-4"
                    >
                      <span className="text-orange-500 text-sm font-bold opacity-50 mb-2">
                        0{i + 1}
                      </span>

                      <span className={`text-5xl font-black italic uppercase tracking-tighter transition-all ${isActive(link.path) ? 'text-orange-500' : 'text-white group-hover:text-orange-500'
                        }`}>
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-20 flex gap-6"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xl text-white">
                  <GiRing />
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Next Show
                  </span>
                  <span className="text-xs font-bold text-white">
                    In Your City
                  </span>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
