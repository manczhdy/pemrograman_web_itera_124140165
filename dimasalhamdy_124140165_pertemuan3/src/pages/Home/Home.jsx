import React, { useMemo, useState } from 'react';
import { useBooks } from '../../context/BookContext';
import BookForm from '../../components/BookForm/BookForm';
import BookList from '../../components/BookList/BookList';
import BookFilter from '../../components/BookFilter/BookFilter';
import useBookStats from '../../hooks/useBookStats';
import './Home.css';

function Home() {
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const stats = useBookStats(books);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [editingBook, setEditingBook] = useState(null);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return books.filter((book) =>
      (statusFilter === 'semua' || book.status === statusFilter) &&
      (book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query))
    );
  }, [books, search, statusFilter]);

  const handleSubmitBook = (data) => {
    if (editingBook) {
      updateBook(editingBook.id, data);
      setEditingBook(null);
    } else addBook(data);
  };

  const handleDelete = (id) => {
    const book = books.find((item) => item.id === id);
    if (book && window.confirm(`Hapus buku "${book.title}" dari daftar?`)) {
      deleteBook(id);
      if (editingBook?.id === id) setEditingBook(null);
    }
  };

  return <main className="page">
    <div className="page-heading">
      <div>
        <h2>Catat buku yang dimiliki, sedang dibaca, dan ingin dibeli.</h2></div>
      <div className="heading-count"><strong>{stats.total}</strong><span>Total buku</span></div>
    </div>
    <section className="dashboard-grid">
      <div className="panel"><BookForm onSubmitBook={handleSubmitBook} editingBook={editingBook}
        onCancelEdit={() => setEditingBook(null)} /></div>
      <div className="panel">
        <div className="list-heading"><h3>Daftar Buku</h3><span className="muted">{filteredBooks.length} dari {books.length}</span></div>
        <BookFilter search={search} onSearchChange={setSearch} statusFilter={statusFilter}
          onStatusChange={setStatusFilter} resultCount={filteredBooks.length} />
        <BookList books={filteredBooks} onEdit={setEditingBook} onDelete={handleDelete} />
      </div>
    </section>
  </main>;
}
export default Home;
