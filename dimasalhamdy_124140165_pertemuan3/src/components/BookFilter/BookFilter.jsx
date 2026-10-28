import React from 'react';
import PropTypes from 'prop-types';
import './BookFilter.css';

function BookFilter({ search, onSearchChange, statusFilter, onStatusChange, resultCount }) {
  return <div className="filter-row book-filter">
    <input className="search-input" type="search" value={search}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Cari judul atau nama penulis..." aria-label="Cari judul atau nama penulis" />
    <select className="filter-select" value={statusFilter}
      onChange={(event) => onStatusChange(event.target.value)} aria-label="Filter status buku">
      <option value="semua">Semua status</option><option value="milik">Milik saya</option>
      <option value="baca">Sedang dibaca</option><option value="beli">Ingin dibeli</option>
    </select>
    <p className="filter-result">{resultCount} buku ditemukan</p>
  </div>;
}

BookFilter.propTypes = {
  search: PropTypes.string.isRequired, onSearchChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.oneOf(['semua', 'milik', 'baca', 'beli']).isRequired,
  onStatusChange: PropTypes.func.isRequired, resultCount: PropTypes.number.isRequired
};
export default BookFilter;
