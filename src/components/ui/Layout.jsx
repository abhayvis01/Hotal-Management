import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHotel } from '../../context/HotelContext';
import { LogOut, User, Menu, X, BedDouble, Shield, Phone, Mail, MapPin } from 'lucide-react';

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const { bookings } = useHotel();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const pendingCount = bookings.filter(b => b.stat === 'NotConfirm').length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = currentUser?.role === 'admin' 
    ? [
        { label: 'Hotel Front', path: '/' },
        { label: 'Admin Dashboard', path: '/admin/bookings', badge: pendingCount > 0 ? pendingCount : null },
      ]
    : [
        { label: 'Accommodations', path: '/' },
        { label: 'Book a Suite', path: '/book' },
        { label: 'My Reservations', path: '/my-bookings' },
      ];

  return (
    <div className="min-h-screen bg-[#0e1626] font-sans flex flex-col antialiased text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Sleek Dark Navbar matching reference screenshot */}
      <nav className="bg-[#121c2d]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Brand Logo with bluebird wing icon */}
            <div className="flex items-center cursor-pointer gap-3" onClick={() => navigate('/')}>
              <div className="bg-gradient-to-tr from-cyan-500 to-bluebird-600 p-2.5 rounded-xl text-white shadow-lg shadow-cyan-500/20">
                <BedDouble size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-serif tracking-wider leading-none">BLUEBIRD</h1>
                <p className="text-[10px] text-amber-400 font-bold tracking-[0.25em] uppercase mt-0.5">Hotel & Resort</p>
              </div>
            </div>

            {/* Desktop Menu matching screenshot styling */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    location.pathname === link.path 
                      ? 'text-amber-400 font-semibold' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-rose-500 text-white rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </Link>
              ))}
              
              {currentUser ? (
                <div className="flex items-center gap-4 pl-6 border-l border-slate-700">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                  <Link to="/login" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all border border-slate-700">
                    Sign In
                  </Link>
                  <Link to="/book" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md">
                    Reserve
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#162236] border-t border-slate-800 px-4 py-3 space-y-1 animate-fade-in shadow-xl">
             {navLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl text-slate-300 hover:bg-slate-800"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[10px] bg-rose-500 text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              {currentUser ? (
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl"
                >
                  Logout ({currentUser.name})
                </button>
              ) : (
                <div className="pt-2 flex flex-col gap-2">
                   <Link 
                     to="/login" 
                     onClick={() => setIsMenuOpen(false)}
                     className="w-full py-2.5 text-center text-xs font-semibold bg-slate-800 text-slate-200 rounded-xl border border-slate-700"
                   >
                     Sign In
                   </Link>
                   <Link 
                     to="/book" 
                     onClick={() => setIsMenuOpen(false)}
                     className="w-full py-2.5 text-center text-xs font-bold bg-amber-500 text-slate-950 rounded-xl shadow"
                   >
                     Reserve a Room
                   </Link>
                </div>
              )}
          </div>
        )}
      </nav>

      {/* Main Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer matching Dark Luxury theme */}
      <footer className="bg-[#0b121e] text-slate-400 py-10 border-t border-slate-800/80 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800 text-center md:text-left">
            <div>
              <h3 className="font-serif text-xl font-bold text-white mb-0.5">BLUEBIRD</h3>
              <p className="text-xs text-slate-400">Luxury Heritage Hotel & Resort Suites</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
              <Link to="/" className="hover:text-amber-400 transition-colors">Accommodations</Link>
              <Link to="/book" className="hover:text-amber-400 transition-colors">Book a Room</Link>
              <Link to="/my-bookings" className="hover:text-amber-400 transition-colors">My Bookings</Link>
              <Link to="/admin/bookings" className="hover:text-amber-400 transition-colors">Admin Dashboard</Link>
            </div>
          </div>
          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4 text-center">
            <p>© 2026 BlueBird Hotel. All rights reserved.</p>
            <p className="text-slate-500">Premium Hotel Management System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

