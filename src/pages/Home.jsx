import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Link } from 'react-router-dom';
import { User, Check, Star, Wifi, Coffee, ShieldCheck, Sparkles, MapPin, Award, Calendar, ArrowRight } from 'lucide-react';

const Home = () => {
  const { rooms } = useHotel();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredRooms = selectedCategory === 'all' 
    ? rooms 
    : rooms.filter(r => (selectedCategory === 'luxury' ? r.rate >= 2000 : r.rate < 2000));

  return (
    <div className="bg-[#0e1626] text-slate-100 min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e1626]/70 via-[#0e1626]/80 to-[#0e1626] z-10" />
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920" 
          alt="BlueBird Luxury Hotel" 
          className="absolute inset-0 w-full h-full object-cover scale-105 brightness-[0.4]"
        />

        <div className="relative z-20 max-w-4xl px-4 py-16 mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Five-Star Heritage Luxury
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold mb-6 text-white tracking-tight leading-tight">
            Unrivaled Elegance. <br />
            <span className="text-amber-400 italic font-normal">Unforgettable Memories.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-light text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Welcome to BlueBird. Immerse yourself in refined luxury, bespoke suites, and world-class hospitality in the heartbeat of the metropolis.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/book" 
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-all shadow-xl hover:shadow-amber-500/20 transform hover:-translate-y-0.5 inline-flex items-center gap-2 text-sm"
            >
              <Calendar size={18} /> Book Your Suite
            </Link>
            <a 
              href="#accommodations" 
              className="px-8 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium rounded-xl border border-slate-700 backdrop-blur-md transition-all inline-flex items-center gap-2 text-sm"
            >
              Explore Rooms <ArrowRight size={18} />
            </a>
          </div>

          {/* Quick Highlight badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-8 border-t border-slate-800 text-left">
            <div>
              <p className="text-2xl font-bold font-serif text-amber-400">98.8%</p>
              <p className="text-xs text-slate-400">Guest Satisfaction</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-amber-400">24/7</p>
              <p className="text-xs text-slate-400">Concierge Desk</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-amber-400">100%</p>
              <p className="text-xs text-slate-400">Direct Booking Guarantee</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-amber-400">4.9 ★</p>
              <p className="text-xs text-slate-400">Over 3,500+ Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accommodations Section */}
      <section id="accommodations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase">Accommodations & Suites</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold mt-1">Our Featured Accommodations</h2>
            <div className="w-16 h-1 bg-amber-500 mt-3 rounded-full" />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mt-6 md:mt-0 bg-[#162236] p-1.5 rounded-xl border border-slate-800">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === 'all' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Rooms
            </button>
            <button 
              onClick={() => setSelectedCategory('luxury')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === 'luxury' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Suites
            </button>
            <button 
              onClick={() => setSelectedCategory('standard')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === 'standard' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Deluxe & Studios
            </button>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <div 
              key={room.id} 
              className="bg-[#162236] rounded-2xl overflow-hidden border border-slate-800 shadow-xl transition-all duration-300 flex flex-col group hover:border-slate-700 hover:-translate-y-1"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1590490360182-f33db079502d?auto=format&fit=crop&q=80&w=1200";
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#162236] via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-3 left-3 bg-[#0e1626]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white border border-slate-700">
                  {room.size || '350 sq ft'}
                </div>

                <div className="absolute top-3 right-3 bg-amber-500/90 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow">
                  <User size={13} /> {room.capacity} Guests
                </div>

                <div className="absolute bottom-3 left-3 text-white">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-white mb-1.5 group-hover:text-amber-400 transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    {room.description || 'Lavish accommodation designed with unmatched craftsmanship and comfort.'}
                  </p>

                  <div className="space-y-1.5 mb-5 border-t border-slate-800 pt-3">
                    {(room.amenities ? room.amenities.slice(0, 3) : ['Free Wi-Fi', '24/7 Room Service', 'HD Smart TV']).map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check size={13} className="text-emerald-400 flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
                    <span className="text-xl font-bold text-amber-400">₹{room.rate}</span>
                    <span className="text-xs text-slate-400"> /night</span>
                  </div>
                  <Link 
                    to={`/book?type=${room.id}`} 
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs transition-all shadow"
                  >
                    Select Room
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

