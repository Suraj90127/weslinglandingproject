import React, { useEffect, useState } from 'react'
import Header from '../Compontnts/Header'
import Footer from '../Compontnts/Footer'
import { motion } from 'framer-motion'
import { FaFistRaised, FaStar, FaHistory, FaGlobeAmericas, FaTrophy, FaMapMarkerAlt, FaQuoteLeft } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../redux/slices/bannerSlice';
import { fetchAllContent } from '../redux/slices/contentSlice';

const About = () => {
  const dispatch = useDispatch();
  const [aboutData, setAboutData] = useState(null);
  const [parsedContent, setParsedContent] = useState(null);

  // Get data from Redux store

  const { banners, loading: bannersLoading } = useSelector((state) => state.banners);
  const { contents, loading: contentLoading } = useSelector((state) => state.contents);

  // ✅ FIXED
  const aboutBanner = banners?.find(
    item => item.pageType?.toLowerCase() === "about"
  );

console.log("aboutBanneraboutBanner",aboutBanner);



  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchBanners());
    dispatch(fetchAllContent());
  }, [dispatch]);

  // Process about data from contents
  useEffect(() => {
    if (contents && contents.length > 0) {
      // Find the about page content by type
      const aboutContent = contents.find(item => item.type === "about");

      if (aboutContent) {
        setAboutData(aboutContent);

        // Parse the JSON content if it exists
        if (aboutContent.content) {
          try {
            // Check if content is a string that needs parsing
            if (typeof aboutContent.content === 'string') {
              // Remove any extra quotes or whitespace
              const cleanContent = aboutContent.content.trim();

              // Check if it's a JSON string (starts with { or [)
              if (cleanContent.startsWith('{') || cleanContent.startsWith('[')) {
                const parsed = JSON.parse(cleanContent);
                setParsedContent(parsed);
              } else {
                // If it's not JSON, create a structured object from the content
                setParsedContent({
                  hero: {
                    since: "2019",
                    title: "THE POWER OF ASIAN WRESTLING",
                    subtitle: aboutContent.description || "We don't just host matches. We create legends. AWE is the pulse of professional wrestling in India."
                  },
                  stats: [
                    { label: "Established", value: "2019", icon: "FaHistory" },
                    { label: "Live Events", value: "10+", icon: "FaTrophy" },
                    { label: "Base City", value: "Gujarat", icon: "FaMapMarkerAlt" },
                    { label: "Future", value: "Global", icon: "FaGlobeAmericas" }
                  ],
                  origin: {
                    title: "A NEW ERA",
                    year: "BORN IN 2018",
                    description: aboutContent.content || "Asian Wrestling Entertainment (AWE) was conceived with a singular, burning vision.",
                    quote: aboutContent.description || "Our goal is to take professional wrestling directly to the fans."
                  },
                  ceo: {
                    name: "Sunny Prajapati",
                    role: "Founder & CEO"
                  },
                  mission: aboutContent.content || "To present professional wrestling live in cities across Gujarat.",
                  vision: "Organizing high-quality wrestling events direct to the fans.",
                  cta: {
                    title: "JOIN THE REVOLUTION",
                    text: aboutContent.description || "Asian Wrestling Entertainment is shaping the future of combat sports in India.",
                    button: "See Upcoming Fights"
                  }
                });
              }
            } else {
              // If it's already an object, use it directly
              setParsedContent(aboutContent.content);
            }
          } catch (error) {
            console.error('Error parsing about content:', error);
            // Fallback to default content
            setParsedContent(null);
          }
        }
      }
    }
  }, [contents]);

  // Default stats in case API data is not available
  const defaultStats = [
    { label: "Established", value: "2019", icon: <FaHistory /> },
    { label: "Live Events", value: "10+", icon: <FaTrophy /> },
    { label: "Base City", value: "Gujarat", icon: <FaMapMarkerAlt /> },
    { label: "Future", value: "Global", icon: <FaGlobeAmericas /> }
  ];

  // Use parsed content or fallback to defaults
  const stats = parsedContent?.stats ? parsedContent.stats.map(stat => ({
    ...stat,
    icon: getIconComponent(stat.icon)
  })) : defaultStats;

  const heroData = parsedContent?.hero || {
    since: "2019",
    title: "THE POWER OF ASIAN WRESTLING",
    subtitle: "We don't just host matches. We create legends. AWE is the pulse of professional wrestling in India."
  };

  const originData = parsedContent?.origin || {
    title: "A NEW ERA",
    year: "BORN IN 2018",
    description: "Asian Wrestling Entertainment (AWE) was conceived with a singular, burning vision: to bridge the gap between Indian wrestling talent and world-class production.",
    quote: "Our goal is to take professional wrestling directly to the fans through live shows, elevating standards across the continent."
  };

  const ceoData = {
    name: parsedContent?.ceo?.name || "Sunny Prajapati",
    role: parsedContent?.ceo?.role || "Founder & CEO",
    image:
      aboutBanner?.images?.[0] ||
      "https://images.unsplash.com/photo-1688828792704-4218151b5d97?auto=format&fit=crop&q=80"
  };

  const missionData = parsedContent?.mission || "To present professional wrestling live in cities across Gujarat, creating excitement and opportunities for talent. After establishing a strong presence in Gujarat, AWE aims to expand across India.";

  const visionData = parsedContent?.vision || "Organizing high-quality wrestling events direct to the fans. AWE is committed to developing talent and elevating wrestling entertainment standards in Asia.";

  const ctaData = parsedContent?.cta || {
    title: "JOIN THE REVOLUTION",
    text: "Asian Wrestling Entertainment is shaping the future of combat sports in India. Be part of the legend.",
    button: "See Upcoming Fights"
  };

  if (bannersLoading || contentLoading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans overflow-x-hidden">
      <Header />

      {/* 1. CINEMATIC HERO SECTION */}
      <motion.section
        className="relative h-[80vh] sm:h-[90vh] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black" />

        {/* Animated Background Elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 -right-20 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-orange-600/10 rounded-full blur-[80px] sm:blur-[120px]"
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] mb-6 sm:mb-8 inline-block">
              Since {heroData.since}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-[120px] font-[1000] italic uppercase leading-[0.9] tracking-tighter mb-6 sm:mb-8">
              {typeof heroData.title === 'string' ? heroData.title.split('<br/>').map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i === 0 && <br className="hidden sm:block" />}
                </React.Fragment>
              )) : heroData.title}
            </h1>
            <p className="max-w-2xl mx-auto text-neutral-400 text-sm sm:text-lg md:text-xl font-medium leading-relaxed px-4">
              {heroData.subtitle}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* 2. FLOATING STATS BAR */}
      <section className="relative z-20 -mt-20 sm:-mt-32 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 bg-white p-6 sm:p-16 rounded-[2rem] sm:rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center group py-2">
                <div className="text-orange-600 text-xl sm:text-2xl mb-2 sm:mb-4 flex justify-center group-hover:scale-110 transition-transform">
                  {stat.icon || <FaHistory />}
                </div>
                <div className="text-2xl sm:text-4xl md:text-6xl font-[1000] text-black italic leading-none mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-[8px] sm:text-[10px] font-black text-neutral-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. FOUNDER'S VISION */}
      <section className="py-16 sm:py-32 px-4 sm:px-6">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -top-10 -left-6 sm:-left-10 text-orange-500/10 text-[8rem] sm:text-[15rem] font-black italic -z-10 select-none">AWE</div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-[1000] uppercase italic tracking-tighter mb-6 sm:mb-8 leading-none">
              {originData.title} <br /> <span className="text-orange-500">{originData.year}</span>
            </h2>
            <div className="space-y-4 sm:space-y-6 text-neutral-400 text-sm sm:text-lg leading-relaxed">
              <p>{originData.description}</p>
              <div className="p-5 sm:p-8 bg-white/5 border-l-4 border-orange-500 rounded-r-xl sm:rounded-r-2xl italic text-white flex gap-3 sm:gap-4">
                <FaQuoteLeft className="text-orange-500 shrink-0 text-lg sm:text-2xl" />
                <p className="text-sm sm:text-base">"{originData.quote}"</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group order-1 lg:order-2"
          >
            <div className="absolute -inset-4 bg-orange-600/20 blur-2xl rounded-full group-hover:bg-orange-600/40 transition-all" />
            <div className="relative rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-white/10 aspect-[4/5] sm:aspect-auto sm:h-[600px]">
              <img
                src={ceoData.image}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                alt={ceoData.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1688828792704-4218151b5d97?auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 bg-gradient-to-t from-black to-transparent">
                <p className="text-orange-500 font-black uppercase text-[10px] tracking-[0.3em] mb-1 sm:mb-2">{ceoData.role}</p>
                <h3 className="text-2xl sm:text-4xl font-black italic uppercase">{ceoData.name}</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. MISSION & VISION */}
      <section className="py-12 sm:py-24 bg-white text-black rounded-[2.5rem] sm:rounded-[4rem] mx-2 sm:mx-10 mb-10 sm:mb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 sm:p-12 bg-neutral-50 rounded-[2rem] sm:rounded-[3rem] border border-neutral-200"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl mb-6 sm:mb-8">
                <FaFistRaised />
              </div>
              <h3 className="text-3xl sm:text-4xl text-black font-[1000] italic uppercase mb-4 sm:mb-6 tracking-tighter">Our Mission</h3>
              <p className="text-neutral-600 text-sm sm:text-lg leading-relaxed font-medium">
                {missionData}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 sm:p-12 bg-black text-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-black text-2xl sm:text-3xl mb-6 sm:mb-8">
                <FaStar />
              </div>
              <h3 className="text-3xl sm:text-4xl font-[1000] italic uppercase mb-4 sm:mb-6 tracking-tighter">Our Vision</h3>
              <p className="text-neutral-400 text-sm sm:text-lg leading-relaxed">
                {visionData}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-24 sm:py-40 text-center relative px-4 sm:px-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto max-w-4xl"
        >
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-[1000] italic uppercase tracking-tighter mb-8 sm:mb-10 leading-none">
            {typeof ctaData.title === 'string' ? ctaData.title.split(' ').map((word, i) =>
              word === 'REVOLUTION' ? <span key={i} className="text-orange-500">{word} </span> : word + ' '
            ) : ctaData.title}
          </h2>
          <p className="text-neutral-500 text-base sm:text-xl mb-8 sm:mb-12 font-medium px-4">
            {ctaData.text}
          </p>
          <button className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-orange-600 text-white font-[1000] uppercase italic tracking-[0.2em] rounded-xl sm:rounded-2xl hover:bg-white hover:text-black transition-all shadow-2xl text-xs sm:text-base">
            {ctaData.button}
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

// Helper function to get icon component from string
const getIconComponent = (iconName) => {
  const icons = {
    FaHistory: <FaHistory />,
    FaTrophy: <FaTrophy />,
    FaMapMarkerAlt: <FaMapMarkerAlt />,
    FaGlobeAmericas: <FaGlobeAmericas />,
    FaFistRaised: <FaFistRaised />,
    FaStar: <FaStar />,
    FaQuoteLeft: <FaQuoteLeft />
  };
  return icons[iconName] || <FaHistory />;
};

const LoadingState = () => (
  <div className="h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default About;



