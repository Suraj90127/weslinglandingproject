import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiMenu, FiUser, FiLogOut, FiSettings,
  FiHelpCircle, FiChevronDown, FiBell
} from 'react-icons/fi';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import { logoutUser } from '../../redux/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isMobile } = useSelector((state) => state.ui);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 py-3">
      <div className="flex items-center justify-between">
        
        {/* Left Section: Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-all lg:hidden"
              aria-label="Toggle sidebar"
            >
              <FiMenu size={24} />
            </button>
          )}
          
          {/* Page Title - Optional */}
          <h1 className="text-xl font-bold text-slate-800 hidden md:block">
            Dashboard
          </h1>
        </div>

        {/* Right Section: Notifications & Profile */}
        <div className="flex items-center gap-4">
          

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
              aria-label="Profile menu"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold shadow-md">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-slate-800 leading-none">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Super Admin</p>
              </div>
              <FiChevronDown className={`text-slate-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} size={14} />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2 animate-in fade-in zoom-in-95">
               
                
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="mr-3" />
                  <span className="text-sm font-bold">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;