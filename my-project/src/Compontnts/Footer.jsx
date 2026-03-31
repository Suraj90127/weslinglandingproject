import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFacebookF, FaInstagram, FaYoutube, FaTiktok,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaBolt,
  FaWhatsapp
} from 'react-icons/fa';
import { FaSnapchatGhost } from 'react-icons/fa';
import NewsLetter from './NewsLetter';

const Footer = () => {
  const socialLinks = [
    {
      icon: <FaFacebookF />,
      url: 'https://www.facebook.com/share/1DiJtruapS/',
      color: 'hover:bg-[#1877F2]',
      label: 'Facebook'
    },
    {
      icon: (
        <svg viewBox="0 0 1200 1227" width="1em" height="1em" fill="currentColor" aria-label="X Logo">
          <path d="M800.5 84.17H1046.5L726.09 474.89L1100.78 984.9H820.47L585.96 681.76L325.76 984.9H79.47L420.91 570.75L68.97 84.17H355.27L567.57 362.28L800.5 84.17ZM752.53 902.55H840.77L448.68 164.27H355.94L752.53 902.55Z"/>
        </svg>
      ),
      url: 'https://x.com/AWEIndia',
      color: 'hover:bg-black',
      label: 'X'
    },
    {
      icon: <FaInstagram />,
      url: 'https://www.instagram.com/aweindias?igsh=MTd4amx5ZTNucGVkaQ==',
      color: 'hover:bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
      label: 'Instagram'
    },
    {
      icon: <FaYoutube />,
      url: 'https://youtube.com/@aweasianwrestlingentertain7138?si=1Gijl_JlclWmrI0Y',
      color: 'hover:bg-[#FF0000]',
      label: 'YouTube'
    },
    {
      icon: <FaSnapchatGhost />,
      url: 'https://www.snapchat.com/add/aweindias',
      color: 'hover:bg-yellow-400',
      label: 'Snapchat'
    },
    {
      icon: <FaWhatsapp />,
      url: 'https://wa.me/916280422290',
      color: 'hover:bg-[#25D366]',
      label: 'WhatsApp'
    }
  ];

  const footerSections = [
    {
      title: 'Navigation',
      links: [
        { name: 'Live Events', path: '/events' },
        { name: 'Media Gallery', path: '/gallery' },
        { name: 'The wrestlers', path: '/wrestlers' },
        { name: 'About AWE', path: '/about' },
        { name: 'Contact Us', path: '/contact_us' },
      ]
    },
    {
      title: 'Fan Zone',
      links: [
        { name: 'F.A.Q', path: '/contact_us' },
        { name: 'Ticket Terms', path: '/contact_us' },
        { name: 'Privacy Center', path: '/contact_us' },
        { name: 'Official Store', path: '/contact_us' },
        { name: 'Help Desk', path: '/contact_us' },
      ]
    }
  ];

  return (
    <>
      <NewsLetter />
      <footer className="relative bg-[#050505] text-gray-400 overflow-hidden border-t border-white/5">
        
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-6">
                 <FaBolt className="text-orange-500 text-2xl" />
                 <h2 className="text-3xl font-[1000] italic text-white uppercase tracking-tighter">
                  AWE <span className="text-orange-500">PRO</span>
                </h2>
              </div>

              <p className="text-sm text-neutral-500 leading-relaxed mb-8 font-medium">
                The premier destination for Asian Wrestling. Delivering high-impact sports entertainment, legendary matches, and global stardom since 2024.
              </p>

              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    whileHover={{ y: -5, scale: 1.1 }}
                    className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all duration-300 ${social.color}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {footerSections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
              >
                <h3 className="text-white font-black uppercase italic tracking-widest text-sm mb-8 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                  {section.title}
                </h3>

                <ul className="space-y-4">
                  {section.links.map((item) => (
                    <li key={item.name}>
                      <Link 
                        to={item.path}
                        className="group text-neutral-500 hover:text-white transition-colors flex items-center gap-3 text-sm font-bold uppercase tracking-wider"
                      >
                        <span className="w-0 group-hover:w-4 h-[2px] bg-orange-500 transition-all duration-300" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-white font-black uppercase italic tracking-widest text-sm mb-8 flex items-center gap-2">
                 <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                 Headquarters
              </h3>

              <div className="space-y-6">

                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-orange-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-600 transition-colors">
                    <FaMapMarkerAlt className="text-orange-500 group-hover:text-white text-sm" />
                  </div>
                  <span className="text-neutral-500 text-sm font-medium">
                    123 Victory Lane, Arena District, Gujarat, India
                  </span>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-orange-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-600 transition-colors">
                    <FaPhone className="text-orange-500 group-hover:text-white text-sm" />
                  </div>
                  <span className="text-neutral-500 text-sm font-medium">
                    +91 6280422290
                  </span>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-orange-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-600 transition-colors">
                    <FaEnvelope className="text-orange-500 group-hover:text-white text-sm" />
                  </div>
                  <span className="text-neutral-500 text-sm font-medium">
                    aweindias@gmail.com
                  </span>
                </div>

              </div>
            </motion.div>

          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600">
              © 2026 ASIAN WRESTLING ENTERTAINMENT. BORN IN THE RING.
            </p>

            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-neutral-600">
              <Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-orange-500 transition-colors">Terms</Link>
              <Link to="/cookies" className="hover:text-orange-500 transition-colors">Licensing</Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;