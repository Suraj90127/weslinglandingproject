import { NavLink, useLocation } from 'react-router-dom';
import {
  FiHome, FiImage, FiCalendar, FiUsers, FiFileText,
  FiSettings, FiHelpCircle, FiLogOut, FiBarChart2, FiX, FiMail
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../../redux/slices/uiSlice';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { sidebarOpen, isMobile } = useSelector((state) => state.ui);
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/banners', icon: FiImage, label: 'Banners' },
    { path: '/events', icon: FiCalendar, label: 'Events' },
    { path: '/players', icon: FiUsers, label: 'Players' },
    { path: '/content', icon: FiFileText, label: 'Content' },
    { path: '/contacts', icon: FiMail, label: 'Contacts' },
  ];



  // Determine if sidebar should be full width
  const showFullSidebar = sidebarOpen || (isHovered && !isMobile);

  const handleCloseSidebar = () => {
    dispatch(setSidebarOpen(false));
  };

  const handleNavClick = () => {
    if (isMobile) {
      dispatch(setSidebarOpen(false));
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
            onClick={handleCloseSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        animate={{
          width: showFullSidebar ? 280 : (isMobile ? 0 : 88),
          x: isMobile && !sidebarOpen ? -280 : 0
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-[70] flex flex-col shadow-xl"
      >
        {/* Logo Section with Close Button */}
        <div className="h-20 flex items-center justify-between px-5 shrink-0 border-b border-slate-100">
          <div className="flex items-center min-w-max">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            {showFullSidebar && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 text-xl font-bold text-slate-800 tracking-tight"
              >
                EventManager
              </motion.span>
            )}
          </div>

          {/* Close button for mobile */}
          {isMobile && sidebarOpen && (
            <button
              onClick={handleCloseSidebar}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              aria-label="Close sidebar"
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Navigation Area */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {/* Main Menu */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className="block"
                >
                  <div className={`
                    flex items-center h-12 px-3 rounded-xl transition-all duration-200 group relative
                    ${isActive
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                  `}>
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activePillar"
                        className="absolute left-0 w-1 h-6 bg-orange-600 rounded-r-full"
                      />
                    )}

                    <item.icon size={20} className={isActive ? 'text-orange-600' : 'group-hover:text-slate-900'} />

                    {showFullSidebar && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-3 text-sm whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {!showFullSidebar && !isMobile && (
                      <div className="absolute left-16 scale-0 group-hover:scale-100 transition-transform bg-slate-900 text-white text-xs px-3 py-2 rounded-lg z-50 whitespace-nowrap shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </div>
                </NavLink>
              );
            })}
          </nav>

        </div>

        {/* Profile Section */}
        <div className="p-4 mt-auto border-t border-slate-100">
          <div className={`flex items-center p-2 rounded-2xl ${showFullSidebar ? 'bg-slate-50' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
              AD
            </div>
            {showFullSidebar && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-3 overflow-hidden"
              >
                <p className="text-sm font-bold text-slate-800 truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@event.com</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;