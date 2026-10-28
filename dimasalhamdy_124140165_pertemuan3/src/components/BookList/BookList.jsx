import React from 'react';
import PropTypes from 'prop-types';
import './BookList.css';

const LABELS = { milik: 'Milik saya', baca: 'Sedang dibaca', beli: 'Ingin dibeli' };

function BookList({ books, onEdit, onDelete }) {
  if (!books.length) return <div className="empty-state"><div className="empty-icon">▤</div><strong>Belum ada buku yang cocok</strong><span>Tambahkan buku atau ubah kata pencarian dan filter status.</span></div>;

  return <div className="book-list">
    {books.map((book) => <article className="book-card" key={book.id}>
      <div className="book-main">
        <h4 className="book-title">{book.title}</h4>
        <p className="book-author">oleh {book.author}</p>
        <span className={`status-badge status-${book.status}`}>{LABELS[book.status]}</span>
      </div>
      <div className="book-actions">
        <button type="button" className="icon-button" onClick={() => onEdit(book)}>Edit</button>
        <button type="button" className="icon-button delete" onClick={() => onDelete(book.id)} aria-label={`Hapus ${book.title}`}>Hapus</button>
      </div>
    </article>)}
  </div>;
}

BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired, author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired
  })).isRequired,
  onEdit: PropTypes.func.isRequired, onDelete: PropTypes.func.isRequired
};
export default BookList;
