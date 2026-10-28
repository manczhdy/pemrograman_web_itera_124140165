import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';

const BookContext = createContext(null);

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) throw new Error('useBooks harus digunakan di dalam BookProvider');
  return context;
}

export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage('personal_books_v1', []);

  const addBook = (data) => setBooks((current) => [...current, {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: data.title.trim(), author: data.author.trim(), status: data.status,
    createdAt: new Date().toISOString()
  }]);

  const updateBook = (id, data) => setBooks((current) => current.map((book) =>
    book.id === id ? { ...book, title: data.title.trim(), author: data.author.trim(), status: data.status } : book
  ));

  const deleteBook = (id) => setBooks((current) => current.filter((book) => book.id !== id));

  const value = useMemo(() => ({ books, addBook, updateBook, deleteBook }), [books]);

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = { children: PropTypes.node.isRequired };
