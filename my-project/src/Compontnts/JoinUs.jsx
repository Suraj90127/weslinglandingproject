import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaCrown, FaGem, FaBolt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const JoinUs = () => {
  const benefits = [
    { icon: <FaStar />, text: "Exclusive Shoots" },
    { icon: <FaCrown />, text: "VIP Backstage" },
    { icon: <FaGem />, text: "Limited Merch" },
    { icon: <FaBolt />, text: "Presale Alerts" }
  ];

  return (
    <section className="relative py-10 md:py-48 overflow-hidden bg-black">
      {/* 1. LAYERED BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1599058917233-35691763c27e?auto=format&fit=crop&q=80')",
          }}
        />
        {/* Intense Brand Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/95 via-orange-600/80 to-transparent"></div>
        {/* Scanning Line Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_4px,4px_100%] pointer-events-none" />
      </div>

      <div className="relative z-20 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Header Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="inline-block px-6 py-2 rounded-full bg-yellow-400 text-black font-black uppercase italic tracking-[0.3em] text-[10px] mb-8 shadow-[0_0_20px_rgba(250,204,21,0.4)]"
          >
            Elite Access Only
          </motion.div>
          
          <h2 className="text-5xl md:text-8xl font-[1000] text-white italic uppercase tracking-tighter leading-none mb-10">
            DON'T JUST WATCH.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">BECOME LEGENDARY.</span>
          </h2>

          {/* Benefit Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] flex flex-col items-center group transition-colors"
              >
                <div className="text-4xl text-yellow-300 mb-3 group-hover:drop-shadow-[0_0_10px_rgba(253,224,71,0.6)]">
                  {benefit.icon}
                </div>
                <p className="text-white text-[10px] font-black uppercase tracking-widest">{benefit.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-white font-medium text-lg md:text-xl max-w-3xl mx-auto mb-12"
          >
            Join the <span className="text-yellow-300 font-black italic">AWE INNER CIRCLE</span> today. Get direct access to athlete Q&As, 
            exclusive merch drops, and the best seats in the arena before they go public.
          </motion.p>

          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="relative group overflow-hidden px-14 py-6 bg-white text-orange-600 font-[1000] text-sm uppercase italic tracking-[.3em] rounded-2xl transition-all"
            >
              <span className="relative z-10">Claim My VIP Pass</span>
              <div className="absolute inset-0 bg-yellow-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinUs;