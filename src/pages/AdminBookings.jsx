import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { CheckCircle, XCircle, Printer, Search, Filter, Calendar, DollarSign, Bed, FileText, Check, Clock, Trash2 } from 'lucide-react';
import { jsPDF } from 'jspdf';

const AdminBookings = () => {
  const { bookings, confirmBooking, deleteBooking } = useHotel();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Computed Dashboard Metrics
  const totalBookings = bookings.length;
  const confirmedCount = bookings.filter(b => b.stat === 'Confirm').length;
  const pendingCount = bookings.filter(b => b.stat === 'NotConfirm').length;
  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.billing?.total || 0), 0);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.guestDetails?.name || b.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.roomType || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || b.stat === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePrintInvoice = (booking) => {
    const doc = new jsPDF();
    
    // Header Branding
    doc.setFillColor(30, 58, 138); // bluebird-900
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("BLUEBIRD HOTEL & RESORT", 20, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Official Guest Billing & Reservation Voucher", 20, 28);
    doc.text("TAX INVOICE", 190, 20, { align: "right" });

    // Guest & Stay Info Boxes
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("RESERVATION SUMMARY", 20, 48);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Booking Reference: #${booking.id.toUpperCase()}`, 20, 56);
    doc.text(`Guest Name: ${booking.guestDetails?.name || booking.name || 'Valued Guest'}`, 20, 63);
    doc.text(`Contact: ${booking.guestDetails?.phone || booking.phone || 'N/A'}`, 20, 70);
    doc.text(`Email: ${booking.guestDetails?.email || booking.email || 'N/A'}`, 20, 77);

    doc.text(`Check-In: ${booking.cin}`, 130, 56);
    doc.text(`Check-Out: ${booking.cout}`, 130, 63);
    doc.text(`Duration: ${booking.nodays} Night(s)`, 130, 70);
    doc.text(`Units: ${booking.noofRoom || 1} Room(s)`, 130, 77);
    doc.text(`Booking Status: ${booking.stat === 'Confirm' ? 'CONFIRMED' : 'PENDING'}`, 130, 84);

    // Pricing Breakdown Table
    let y = 100;
    doc.setFillColor(240, 245, 255);
    doc.rect(20, y - 6, 170, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("Description", 24, y);
    doc.text("Amount (INR)", 186, y, { align: "right" });

    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);

    const roomRate = Number(booking.billing?.room || 0).toFixed(2);
    doc.text(`Room Accommodation (${booking.roomType} x ${booking.nodays} nights)`, 24, y);
    doc.text(`INR ${roomRate}`, 186, y, { align: "right" });
    y += 10;
    doc.line(20, y - 4, 190, y - 4);

    const bedRate = Number(booking.billing?.bed || 0).toFixed(2);
    doc.text(`Bedding Configuration Surcharge (${booking.bed})`, 24, y);
    doc.text(`INR ${bedRate}`, 186, y, { align: "right" });
    y += 10;
    doc.line(20, y - 4, 190, y - 4);

    const mealRate = Number(booking.billing?.meal || 0).toFixed(2);
    doc.text(`Dining & Meal Plan Plan (${booking.meal})`, 24, y);
    doc.text(`INR ${mealRate}`, 186, y, { align: "right" });
    y += 14;

    // Total box
    doc.setFillColor(248, 250, 252);
    doc.rect(20, y - 6, 170, 14, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text("NET PAYABLE AMOUNT", 24, y + 3);
    const totalRate = Number(booking.billing?.total || 0).toFixed(2);
    doc.text(`INR ${totalRate}`, 186, y + 3, { align: "right" });

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(130, 130, 130);
    doc.text("Thank you for choosing BlueBird Hotel & Resort. For assistance: reservations@bluebird.com", 105, 275, { align: "center" });

    doc.save(`BlueBird_Invoice_${booking.id}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">Management Dashboard</span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Bookings & Reservations</h1>
        </div>
        <div className="text-xs text-slate-300 bg-[#162236] px-4 py-2 rounded-xl border border-slate-700 shadow-sm inline-flex items-center gap-2">
          <Clock size={15} className="text-amber-400" /> Front Desk Live Sync Active
        </div>
      </div>

      {/* Analytics Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-[#162236] p-5 rounded-2xl border border-slate-700/80 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-blue-950 text-blue-400 rounded-xl border border-blue-800/50">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Total Bookings</p>
            <h3 className="text-2xl font-bold font-serif text-white">{totalBookings}</h3>
          </div>
        </div>

        <div className="bg-[#162236] p-5 rounded-2xl border border-slate-700/80 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800/50">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Confirmed</p>
            <h3 className="text-2xl font-bold font-serif text-emerald-400">{confirmedCount}</h3>
          </div>
        </div>

        <div className="bg-[#162236] p-5 rounded-2xl border border-slate-700/80 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-amber-950 text-amber-400 rounded-xl border border-amber-800/50">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Pending Review</p>
            <h3 className="text-2xl font-bold font-serif text-amber-400">{pendingCount}</h3>
          </div>
        </div>

        <div className="bg-[#162236] p-5 rounded-2xl border border-slate-700/80 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-indigo-950 text-indigo-400 rounded-xl border border-indigo-800/50">
            <DollarSign size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Total Value</p>
            <h3 className="text-2xl font-bold font-serif text-amber-400">₹{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#162236] p-4 rounded-2xl border border-slate-700/80 shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by guest, ID or room..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#0e1626] border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          {['ALL', 'Confirm', 'NotConfirm'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === status 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {status === 'ALL' ? 'All' : status === 'Confirm' ? 'Confirmed' : 'Pending'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#162236] rounded-2xl shadow-xl border border-slate-700/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121c2d] text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">Ref ID</th>
                <th className="px-6 py-4">Guest Information</th>
                <th className="px-6 py-4">Room & Plan</th>
                <th className="px-6 py-4">Stay Duration</th>
                <th className="px-6 py-4 text-right">Invoice Total</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-400">
                    #{booking.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-sm">
                      {booking.guestDetails?.name || booking.name || 'Guest'}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {booking.guestDetails?.phone || booking.phone}
                    </p>
                    <p className="text-slate-500 text-[10px]">
                      {booking.guestDetails?.email || booking.email}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-amber-400 capitalize">
                      {booking.roomType}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {booking.bed} Bed • {booking.meal}
                    </p>
                    <p className="text-slate-500 text-[10px]">
                      {booking.noofRoom || 1} Room(s)
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-200">
                      {booking.cin} <span className="text-slate-500">→</span> {booking.cout}
                    </p>
                    <span className="inline-block mt-0.5 text-[11px] font-semibold text-emerald-400">
                      {booking.nodays} Night{booking.nodays > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold font-serif text-amber-400 text-sm">
                      ₹{Number(booking.billing?.total || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      booking.stat === 'Confirm'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                        : 'bg-amber-950 text-amber-400 border border-amber-700/50'
                    }`}>
                      {booking.stat === 'Confirm' ? (
                        <><Check size={11} /> Confirmed</>
                      ) : (
                        <><Clock size={11} /> Pending</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {booking.stat === 'NotConfirm' && (
                        <button
                          onClick={() => confirmBooking(booking.id)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-[11px] inline-flex items-center gap-1 shadow-sm"
                          title="Confirm Reservation"
                        >
                          <CheckCircle size={13} /> Confirm
                        </button>
                      )}
                      <button
                        onClick={() => handlePrintInvoice(booking)}
                        className="p-1.5 text-blue-400 hover:bg-blue-950 rounded-lg transition-colors border border-blue-800/60"
                        title="Download Tax Invoice"
                      >
                        <Printer size={15} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this reservation?")) {
                            deleteBooking(booking.id);
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-950 rounded-lg transition-colors border border-rose-800/60"
                        title="Delete Reservation"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    <FileText size={32} className="mx-auto text-slate-600 mb-2" />
                    No reservations matching current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;

