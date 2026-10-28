import React from 'react';
import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';

function Navigation() {
  return <header className="topbar"><div className="topbar-inner">
<div>
      <h1>Rak Buku Pribadi</h1><p>Catat. Baca. Kembangkan diri.</p></div>
    <nav className="nav-links" aria-label="Navigasi utama">
      <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Koleksi Buku</NavLink>
      <NavLink to="/stats" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Statistik</NavLink>
    </nav>
  </div></header>;
}

function App() {
  return <BrowserRouter><BookProvider><div className="app-shell"><Navigation />
    <Routes><Route path="/" element={<Home />} /><Route path="/stats" element={<Stats />} />
      <Route path="*" element={<Navigate to="/" replace />} /></Routes>
  </div></BookProvider></BrowserRouter>;
}
export default App;
