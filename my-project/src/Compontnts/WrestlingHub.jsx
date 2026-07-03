import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaTicketAlt, FaPlayCircle, FaStar, FaUsers,
  FaVideo, FaNewspaper, FaShoppingCart, FaGamepad, FaBolt
} from 'react-icons/fa';

const WrestlingHUb = () => {
  const features = [
    {
      icon: <FaTicketAlt />,
      title: "Live Events",
      description: "Stream every pay-per-view and weekly show live from any device, anywhere in the world."
    },
    {
      icon: <FaPlayCircle />,
      title: "Vast Library",
      description: "Thousands of hours of on-demand content, including classic matches and historic moments."
    },
    {
      icon: <FaStar />,
      title: "Exclusive Shows",
      description: "Original series, documentaries, and interviews you won't find anywhere else."
    },
    {
      icon: <FaUsers />,
      title: "Community",
      description: "Connect with millions of fans, participate in polls, and share your favorite moments."
    },
    {
      icon: <FaVideo />,
      title: "Highlights",
      description: "Watch full match replays and highlights available immediately after they air."
    },
    {
      icon: <FaNewspaper />,
      title: "Breaking News",
      description: "Stay updated with rumors and exclusive interviews from your favorite superstars."
    },
    {
      icon: <FaShoppingCart />,
      title: "Merchandise",
      description: "Shop for exclusive wrestling apparel and collectibles from top-tier wrestlers."
    },
    
  ];

  return (
    <section className="py-10 md:py-40 bg-[#050505] relative overflow-hidden">
      {/* 1. ATMOSPHERIC OVERLAYS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-600/5 blur-[150px] rounded-full" />
        {/* Subtle Grid Texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER SECTION */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-[2px] w-12 bg-orange-600" />
            <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px]">The Ecosystem</span>
            <div className="h-[2px] w-12 bg-orange-600" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-[1000] text-white italic uppercase tracking-tighter leading-none"
          >
            THE ULTIMATE <span className="text-orange-600">ARENA</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-8 text-neutral-400 text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            Experience the raw power of AWE. From the front row to the backstage area, we bring the ring to you.
          </motion.p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,0.03)" }}
              className="group relative p-8 rounded-[2.5rem] bg-neutral-900/40 border border-white/5 backdrop-blur-sm transition-all duration-500 overflow-hidden"
            >
              {/* Hover Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-[2.5rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl text-orange-500 mb-8 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-xl">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-4 flex items-center gap-2">
                  {feature.title}
                  <FaBolt className="text-[10px] text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>

                <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DYNAMIC CALL TO ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-12 py-6 bg-white text-black font-[1000] text-sm uppercase italic tracking-[.3em] rounded-2xl flex items-center gap-4"
            >
              Enter the Hub <FaArrowRight className="text-orange-600" />
            </motion.button>
          </div>
        </motion.div> {/* FIXED: Was missing this closing tag in your snippet */}
      </div>
    </section>
  );
};

/* Internal helper for icon/cleanliness */
const FaArrowRight = ({ className }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default WrestlingHUb;

