import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Calculator, Calendar, Users, Bed, Utensils, CheckCircle2, ShieldAlert, ArrowLeft, Sparkles, Clock, Check } from 'lucide-react';
import { differenceInDays, addDays, format } from 'date-fns';

const Book = () => {
  const { rooms, calculateTotal, addBooking } = useHotel();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    roomType: searchParams.get('type') || 'superior',
    bed: 'Single',
    meal: 'Room Only',
    noofRoom: 1,
    cin: format(new Date(), 'yyyy-MM-dd'),
    cout: format(addDays(new Date(), 2), 'yyyy-MM-dd')
  });

  const [pricing, setPricing] = useState({ room: 0, bed: 0, meal: 0, total: 0 });
  const [days, setDays] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const selectedRoom = rooms.find(r => r.id === formData.roomType) || rooms[0];

  useEffect(() => {
    const start = new Date(formData.cin);
    const end = new Date(formData.cout);
    const diff = differenceInDays(end, start);
    const validDiff = diff > 0 ? diff : 0;
    setDays(validDiff);

    if (validDiff > 0) {
      const costs = calculateTotal(
        formData.roomType, 
        formData.bed, 
        formData.meal, 
        parseInt(formData.noofRoom), 
        validDiff
      );
      setPricing(costs);
    }
  }, [formData, rooms]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (days <= 0) {
      alert("Check-out date must be strictly after Check-in date.");
      return;
    }

    setIsSubmitting(true);

    const bookingUserId = currentUser?.id || ('guest_' + formData.email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_'));

    setTimeout(() => {
      addBooking({
        ...formData,
        nodays: days,
        userId: bookingUserId,
        guestDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      });

      setIsSubmitting(false);
      setSuccessMessage(true);

      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);
    }, 600);
  };

  return (
    <div className="relative min-h-[90vh] py-10 px-4 flex items-center justify-center">
      {/* Background Palace image matching reference */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920" 
          alt="BlueBird Resort" 
          className="w-full h-full object-cover brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {successMessage && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 flex items-center gap-3">
            <CheckCircle2 size={22} className="text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-xs">Reservation Successful!</h4>
              <p className="text-[11px] text-emerald-400">Directing to My Bookings...</p>
            </div>
          </div>
        )}

        {/* Modal-style Dark Card Matching Reference Image */}
        <div className="bg-[#242f40] border border-slate-700/80 rounded-2xl shadow-2xl text-slate-200 p-6 sm:p-8 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/60">
            <h2 className="text-xl font-bold tracking-wider text-amber-500 uppercase font-sans">
              Reservation
            </h2>
            <Link 
              to="/" 
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              ✕
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Section 1: Guest Information */}
            <div>
              <p className="text-sm font-semibold text-white mb-2.5">Guest Information</p>
              <div className="space-y-2.5">
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1b2432] border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 text-xs" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                />

                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1b2432] border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 text-xs" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required 
                />

                <select 
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1b2432] border border-slate-700 text-slate-300 focus:outline-none focus:border-amber-500 text-xs"
                >
                  <option value="IN">India (+91)</option>
                  <option value="US">United States (+1)</option>
                  <option value="UK">United Kingdom (+44)</option>
                  <option value="AE">United Arab Emirates (+971)</option>
                  <option value="OTHER">Other Country</option>
                </select>

                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1b2432] border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 text-xs" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  required 
                />
              </div>
            </div>

            {/* Section 2: Room Details */}
            <div className="pt-2">
              <p className="text-sm font-semibold text-white mb-2.5">Room Details</p>
              <div className="space-y-2.5">
                <select 
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1b2432] border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  value={formData.roomType}
                  onChange={e => setFormData({...formData, roomType: e.target.value})}
                >
                  <option value="" disabled>Select Room Type</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} (₹{r.rate}/night)
                    </option>
                  ))}
                </select>

                <select 
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1b2432] border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  value={formData.bed}
                  onChange={e => setFormData({...formData, bed: e.target.value})}
                >
                  <option value="" disabled>Bedding Type</option>
                  <option value="Single">Single (1%)</option>
                  <option value="Double">Double (2%)</option>
                  <option value="Triple">Triple (3%)</option>
                  <option value="Quad">Quad (4%)</option>
                  <option value="None">None (0%)</option>
                </select>

                <select 
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1b2432] border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  value={formData.noofRoom}
                  onChange={e => setFormData({...formData, noofRoom: e.target.value})}
                >
                  <option value="" disabled>Number of Rooms</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                  ))}
                </select>

                <select 
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1b2432] border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  value={formData.meal}
                  onChange={e => setFormData({...formData, meal: e.target.value})}
                >
                  <option value="" disabled>Meal Plan</option>
                  <option value="Room Only">Room Only</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Half Board">Half Board</option>
                  <option value="Full Board">Full Board</option>
                </select>

                {/* Dates Side by Side matching UI */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Check-In</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 rounded-lg bg-white text-slate-900 font-medium focus:outline-none text-xs"
                      value={formData.cin}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      onChange={e => setFormData({...formData, cin: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Check-Out</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 rounded-lg bg-white text-slate-900 font-medium focus:outline-none text-xs"
                      value={formData.cout}
                      min={formData.cin}
                      onChange={e => setFormData({...formData, cout: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <select 
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1b2432] border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                >
                  <option value="PAY_AT_HOTEL">Payment Method: Pay at Check-In</option>
                  <option value="UPI">Credit Card / UPI</option>
                </select>
              </div>
            </div>

            {/* Price Preview Strip */}
            <div className="p-3 rounded-lg bg-[#1b2432] border border-slate-700 flex justify-between items-center text-xs mt-3">
              <span className="text-slate-400">Total Estimation ({days} Night{days > 1 ? 's' : ''})</span>
              <span className="font-bold text-amber-400 text-base">₹{pricing.total.toFixed(0)}</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex gap-3">
              <Link 
                to="/" 
                className="w-1/3 py-2.5 text-center rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs transition-colors"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={isSubmitting || days <= 0}
                className="w-2/3 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Reservation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Book;


