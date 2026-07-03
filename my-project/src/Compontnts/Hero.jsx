import React, { useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../redux/slices/eventSlice";


import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaTrophy,
  FaFire
} from "react-icons/fa";

import { FaSnapchatGhost } from "react-icons/fa";
import { PiXLogoFill } from "react-icons/pi";

import { TiArrowRight } from "react-icons/ti";



const socialLinks = [
  {
    name: "instagram",
    link: "https://www.instagram.com/aweindias?igsh=MTd4amx5ZTNucGVkaQ=="
  },
  {
    name: "facebook",
    link: "https://www.facebook.com/share/1DiJtruapS/"
  },
  {
    name: "youtube",
    link: "https://youtube.com/@aweasianwrestlingentertain7138?si=1Gijl_JlclWmrI0Y"
  },
  {
    name: "X",
    link: "https://x.com/AWEIndia"
  },
  {
    name: "snapchat",
    link: "https://www.snapchat.com/add/aweindias"
  },
  {
    name: "whatsapp",
    link: "https://wa.me/916280422290"
  }
];

const TimeBox = ({ value, label }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-inner flex-1 sm:w-24 h-20 sm:h-28"
  >
    <span className="text-xl sm:text-3xl font-black text-white">
      {String(value).padStart(2, "0")}
    </span>

    <span className="text-[8px] sm:text-[10px] font-black text-orange-500 uppercase mt-1">
      {label}
    </span>
  </motion.div>
);

const Hero = () => {
  const dispatch = useDispatch();
  const { contents } = useSelector((state) => state.contents);
  const { events } = useSelector((state) => state.events);

  const [heroData, setHeroData] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  // Find next upcoming event (future date only)
  const nextUpcomingEvent = useMemo(() => {
    if (!events || events.length === 0) return null;
    const now = new Date();
    const future = events
      .filter(e => e.date && new Date(e.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return future[0] || null;
  }, [events]);

  // Fetch events on mount (only if not loaded yet)
  useEffect(() => {
    if (!events || events.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch]);

  const iconMap = {
    facebook: FaFacebookF,
    X: PiXLogoFill,
    youtube: FaYoutube,
    instagram: FaInstagram,
    snapchat: FaSnapchatGhost,
    whatsapp: FaWhatsapp
  };

  // Parse hero content
  useEffect(() => {
    if (contents && contents.length > 0) {
      const heroContent = contents.find(item => item.type === "hero");
      if (heroContent?.content) {
        try {
          const parsed =
            typeof heroContent.content === "string"
              ? JSON.parse(heroContent.content)
              : heroContent.content;
          setHeroData(parsed);
        } catch (error) {
          console.error("Hero JSON parse error:", error);
        }
      }
    }
  }, [contents]);

  // Countdown timer — prefer real upcoming event, fallback to heroData
  useEffect(() => {
    let targetMs = null;

    if (nextUpcomingEvent?.date) {
      // Use real event date (it already includes time as ISO string)
      targetMs = new Date(nextUpcomingEvent.date).getTime();
    } else if (heroData?.event?.date && heroData?.event?.time) {
      targetMs = new Date(
        `${heroData.event.date}T${heroData.event.time}`
      ).getTime();
    }

    if (!targetMs) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetMs - now;

      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextUpcomingEvent, heroData]);

  if (!heroData && (!events || events.length === 0)) {
    return (
      <div className="h-[600px] sm:h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-[100dvh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background glow */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(249,115,22,0.15)_0%,transparent_70%)]"
        />
      </div>

      {/* Background text */}
      <motion.h2
        style={{ y: y1 }}
        className="absolute top-1/4 left-0 w-full text-center text-[22vw] sm:text-[18vw] lg:text-[20vw] font-black italic uppercase opacity-[0.03] text-white pointer-events-none"
      >
        LEGENDARY
      </motion.h2>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-16 sm:pt-20">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 text-center lg:text-left">

            <motion.div
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="inline-flex items-center gap-3 px-4 py-2 mb-6 bg-orange-600/10 border border-orange-600/30 rounded-full"
            >

              <FaFire className="text-orange-500 animate-bounce" />

              <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em]">
                {heroData?.season?.title || "BATTLE FOR GLORY"}
              </span>

            </motion.div>

            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[110px] font-[1000] italic leading-[0.9] uppercase tracking-tight text-white mb-6"
            >
              {heroData?.heroText?.title1 || "UNLEASH THE"}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600">
                {heroData?.heroText?.title2 || "WRESTLING FURY"}
              </span>
            </motion.h1>

            <p className="text-sm sm:text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0 mb-8">
              {heroData?.heroText?.description || "Experience the most intense professional wrestling matches featuring legends and rising stars."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
              {heroData?.buttons ? (
                heroData.buttons.map((btn, i) => (
                  <Link key={i} to={btn.link} className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full sm:w-auto px-8 py-4 font-black rounded-2xl uppercase italic flex items-center justify-center gap-3
                      ${btn.type === "primary"
                          ? "bg-orange-600 text-white"
                          : "border-2 border-white/20 text-white backdrop-blur-md"
                        }`}
                    >
                      {btn.text}
                      {btn.type === "primary" && <TiArrowRight className="text-xl" />}
                    </motion.button>
                  </Link>
                ))
              ) : (
                <Link to="/events" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-orange-600 text-white font-black rounded-2xl uppercase italic flex items-center justify-center gap-3"
                  >
                    Book Tickets
                    <TiArrowRight className="text-xl" />
                  </motion.button>
                </Link>
              )}
            </div>

          </div>

          {/* RIGHT TIMER */}
          <div className="lg:col-span-5">

            <motion.div
              style={{ y: y2 }}
              className="relative p-1 bg-gradient-to-br from-white/20 to-transparent rounded-3xl shadow-2xl"
            >

              <div className="bg-[#111]/90 backdrop-blur-3xl p-6 sm:p-10 rounded-3xl text-center border border-white/5">

                <h3 className="text-xl sm:text-3xl font-black italic uppercase text-white mb-8">
                  {nextUpcomingEvent?.title || heroData?.event?.title || "NEXT BATTLE"}
                </h3>

                <div className="flex sm:grid sm:grid-cols-4 gap-2 sm:gap-4">

                  <TimeBox value={timeLeft.d} label="Days" />
                  <TimeBox value={timeLeft.h} label="Hrs" />
                  <TimeBox value={timeLeft.m} label="Min" />
                  <TimeBox value={timeLeft.s} label="Sec" />

                </div>

                <div className="mt-8 flex flex-col items-center gap-2">

                  <span className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase">
                    <FaTrophy /> {nextUpcomingEvent
                      ? `${nextUpcomingEvent.matches?.length || 0} Championship Matches`
                      : (heroData?.event?.tag || "World Championship")}
                  </span>

                  <p className="text-neutral-500 text-xs uppercase">
                    {nextUpcomingEvent
                      ? (nextUpcomingEvent.venue || heroData?.event?.location || "Main Arena")
                      : (heroData?.event?.location || "Main Arena")}
                  </p>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

        {/* SOCIAL + MARQUEE */}
        <div className="mt-12 lg:mt-20 border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex gap-6 opacity-40">
            {socialLinks.map((item, i) => {
              const Icon = iconMap[item.name];
              if (!Icon) return null;
              return (
                <a
                  key={i}
                  href={item.link || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon className="text-xl text-white hover:text-orange-500 transition-colors cursor-pointer" />
                </a>
              );
            })}
          </div>

          <span className="text-white/10 text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] whitespace-nowrap">
            {heroData?.marquee?.text || "BATTLE FOR GLORY • STREAMING LIVE • GET TICKETS NOW"}
          </span>

        </div>

      </div>
    </section>
  );
};

export default Hero;