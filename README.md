# Hotel Management Web Application

A full-featured, luxury Hotel Management System built with React 19, Tailwind CSS v4, and Vite.

## ✨ Features

- **Luxury Guest Experience**: Immersive dark luxury UI with smooth accommodation browsing.
- **Dynamic Reservation Flow**: Real-time accommodation pricing engine calculating room, bedding surcharges, and meal packages.
- **Guest Portal (`/my-bookings`)**: Live tracking of reserved rooms, stay status, and instant tax invoice/receipt generation in PDF format.
- **Executive Admin Dashboard (`/admin/bookings`)**:
  - Live revenue & booking performance metrics.
  - Quick-search & status filtering (Confirmed / Pending).
  - One-click confirmation and deletion controls.
  - High-resolution, branded PDF invoice export using `jspdf`.
- **Authentication**: Responsive portal login with role-based routing (Admin & Guest).

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

## 🛠 Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + PostCSS
- **Routing**: React Router v7
- **Document Generation**: jsPDF
- **Icons**: Lucide React
- **Date Handling**: date-fns
