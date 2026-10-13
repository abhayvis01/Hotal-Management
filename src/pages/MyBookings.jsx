import React from 'react';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Bed, Utensils, CheckCircle, Clock, Printer, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const MyBookings = () => {
  const { bookings } = useHotel();
  const { currentUser } = useAuth();
  
  const currentEmail = currentUser?.email?.toLowerCase().trim();
  const currentId = currentUser?.id;

  const myBookings = bookings.filter(b => {
    // If user has bookings matching their ID
    if (currentId && b.userId === currentId) return true;
    
    // If user has bookings matching their email
    if (currentEmail) {
      const bEmail = (b.guestDetails?.email || b.email || '').toLowerCase().trim();
      if (bEmail && bEmail === currentEmail) return true;
    }

    // If guest is not logged in or in demo mode, show all guest bookings
    if (!currentUser || currentUser.role === 'guest') {
      return true;
    }

    return false;
  });

  const handleDownloadReceipt = (booking) => {
    const doc = new jsPDF();
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("BLUEBIRD HOTEL & RESORT", 20, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Guest Reservation Receipt", 20, 25);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Booking Ref: #${booking.id}`, 20, 45);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Guest: ${booking.guestDetails?.name || booking.name}`, 20, 53);
    doc.text(`Room: ${booking.roomType.toUpperCase()}`, 20, 60);
    doc.text(`Bed: ${booking.bed} | Dining: ${booking.meal}`, 20, 67);
    doc.text(`Check In: ${booking.cin} -> Check Out: ${booking.cout}`, 20, 74);
    doc.text(`Duration: ${booking.nodays} Night(s)`, 20, 81);

    doc.line(20, 90, 190, 90);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("Total Paid / Payable:", 20, 100);
    doc.text(`INR ${Number(booking.billing?.total || 0).toFixed(2)}`, 190, 100, { align: "right" });

    doc.save(`BlueBird_Receipt_${booking.id}.pdf`);
  };

  return (
    <div className="relative min-h-[90vh] py-10 px-4">
      {/* Background Palace image matching reference screenshot */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920" 
          alt="BlueBird Resort" 
          className="w-full h-full object-cover brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
              My Bookings
            </h1>
            <p className="text-xs text-slate-300 mt-1">Review your room reservations and confirmation status.</p>
          </div>
          <Link 
            to="/book" 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-lg transition-all"
          >
            <Plus size={16} /> New Reservation
          </Link>
        </div>

        <div className="space-y-4">
          {myBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="bg-[#242f40]/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-slate-200 transition-all hover:border-slate-600"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700/60">
                <h3 className="text-xl font-bold text-amber-500 capitalize font-sans">
                  {booking.roomType} Room
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                    booking.stat === 'Confirm' 
                      ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-600/50' 
                      : 'bg-amber-900/80 text-amber-300 border border-amber-600/50'
                  }`}>
                    {booking.stat === 'Confirm' ? 'Confirm' : 'Pending'}
                  </span>
                  {booking.stat === 'Confirm' && (
                    <button
                      onClick={() => handleDownloadReceipt(booking)}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-900/80 text-blue-200 border border-blue-600/40 hover:bg-blue-800 transition-colors inline-flex items-center gap-1"
                      title="Download Voucher"
                    >
                      <Printer size={12} /> Voucher
                    </button>
                  )}
                </div>
              </div>

              {/* Grid matching reference image */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
                <div>
                  <span className="block text-slate-400 text-[11px] mb-1">Check-In</span>
                  <span className="font-bold text-white text-sm">{booking.cin}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[11px] mb-1">Check-Out</span>
                  <span className="font-bold text-white text-sm">{booking.cout}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[11px] mb-1">Number of Rooms</span>
                  <span className="font-bold text-white text-sm">{booking.noofRoom || 1}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[11px] mb-1">Bedding</span>
                  <span className="font-bold text-white text-sm">{booking.bed || 'Single'}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[11px] mb-1">Meal Plan</span>
                  <span className="font-bold text-white text-sm">{booking.meal || 'Room Only'}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[11px] mb-1">Booking ID</span>
                  <span className="font-bold text-white text-sm">#{booking.id.slice(0, 6)}</span>
                </div>
              </div>
            </div>
          ))}

          {myBookings.length === 0 && (
            <div className="text-center py-16 bg-[#242f40]/80 backdrop-blur-md rounded-2xl border border-dashed border-slate-700 p-8 text-slate-300">
              <Bed size={40} className="mx-auto text-slate-400 mb-3" />
              <h3 className="text-lg font-bold text-white">No Reservations Found</h3>
              <p className="text-xs text-slate-400 mt-1 mb-6 max-w-sm mx-auto">
                You haven't reserved any rooms yet. Complete a reservation to view your booking here.
              </p>
              <Link 
                to="/book" 
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow"
              >
                Book Now <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;

