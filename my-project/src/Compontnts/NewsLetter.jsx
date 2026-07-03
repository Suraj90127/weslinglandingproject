import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPaperPlane, FaCheckCircle, FaBell } from 'react-icons/fa';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
    setEmail('');
    
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section className="relative py-10 sm:py-20 bg-[#080808] overflow-hidden border-t border-white/5">
      {/* 1. ANIMATED BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(234,88,12,0.15),transparent_70%)]" />
        
        {/* Floating Accent Circles - Scaled down for mobile */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-orange-600/10 blur-[80px] sm:blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-32 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-yellow-500/5 blur-[100px] sm:blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-neutral-900 to-black p-8 md:p-16 rounded-[2rem] sm:rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Diagonal Rope Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[length:40px_40px] bg-[linear-gradient(45deg,white_25%,transparent_25%,transparent_50%,white_50%,white_75%,transparent_75%,transparent)]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center relative z-10"
          >
            {/* Header Icon */}
            <div className="mb-6 sm:mb-8 relative inline-block">
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-600 rounded-2xl sm:rounded-3xl flex items-center justify-center text-2xl sm:text-3xl text-white shadow-[0_0_30px_rgba(234,88,12,0.4)] mx-auto"
                >
                    <FaBell />
                </motion.div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-4 border-neutral-900 animate-pulse" />
            </div>
            
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter text-white mb-4 sm:mb-6 leading-none">
              JOIN THE <span className="text-orange-600">INNER CIRCLE</span>
            </h2>
            
            <p className="text-neutral-400 text-sm sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto font-medium px-2">
              Get the card lineups, ticket alerts, and backstage footage delivered straight to your inbox.
            </p>

            {/* Form - Stacked on mobile, side-by-side on md+ */}
            <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative group">
                  <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-orange-500 transition-colors text-sm" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL..."
                    className="w-full pl-12 pr-6 py-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-600 focus:bg-white/10 transition-all font-bold uppercase tracking-widest text-[10px] sm:text-xs"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#fff", color: "#000" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-5 sm:px-10 sm:py-6 bg-orange-600 text-white font-[1000] uppercase italic tracking-[.2em] rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-3 text-xs sm:text-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign Up <FaPaperPlane />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Success Message - Fixed positioning for mobile overlap */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 md:absolute md:-bottom-16 left-0 right-0 flex items-center justify-center gap-2 text-green-400 font-black uppercase text-[9px] sm:text-xs tracking-widest"
                  >
                    <FaCheckCircle className="text-lg" />
                    Transmission Received. Check your inbox!
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <p className="text-neutral-600 text-[8px] sm:text-[10px] font-black uppercase tracking-[.3em] mt-12 sm:mt-16">
              NO SPAM. JUST PURE ADRENALINE.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;