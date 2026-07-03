import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaTiktok,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronUp, FaBolt,
  FaUsers, FaCalendarAlt, FaImages, FaInfoCircle, FaArrowRight,
  FaShieldAlt, FaTicketAlt
} from 'react-icons/fa';
import { GiRing } from 'react-icons/gi';

const MobileFooter = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = [
    { icon: <FaFacebookF />, url: '#', color: 'bg-[#1877F2]' },
    { icon: <FaInstagram />, url: '#', color: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]' },
    { icon: <FaTwitter />, url: '#', color: 'bg-[#1DA1F2]' },
    { icon: <FaYoutube />, url: '#', color: 'bg-[#FF0000]' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/', icon: <FaBolt /> },
    { name: 'Events', path: '/events', icon: <FaTicketAlt /> },
    { name: 'wrestlers', path: '/wrestlers', icon: <FaUsers /> },
    { name: 'Media', path: '/gallery', icon: <FaImages /> },
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <footer className="md:hidden relative bg-[#050505] text-gray-400 font-sans border-t border-white/5 pb-24">
      
      

      {/* 5. NATIVE-STYLE TAB BAR NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2 pointer-events-none">
        <div className="max-w-md mx-auto bg-[#121212]/90 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex justify-around items-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-auto">
          {quickLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.name} to={link.path} className="relative py-2 px-5 flex flex-col items-center">
                <motion.span 
                    animate={{ 
                        color: isActive ? '#f97316' : '#525252',
                        scale: isActive ? 1.2 : 1 
                    }}
                    className="text-lg mb-1"
                >
                    {link.icon}
                </motion.span>
                <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-neutral-600'}`}>
                    {link.name}
                </span>
                {isActive && (
                    <motion.div 
                        layoutId="active-pill" 
                        className="absolute inset-0 bg-orange-600/10 rounded-full -z-10" 
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* FLOAT SCROLL TO TOP */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-28 right-6 w-14 h-14 bg-white text-black rounded-2xl shadow-2xl flex items-center justify-center z-50 border-4 border-black"
          >
            <FaChevronUp className="text-orange-600" />
          </motion.button>
        )}
      </AnimatePresence>

    </footer>
  );
};

export default MobileFooter;