import { useMemo } from 'react';
import PropTypes from 'prop-types';

export default function useBookStats(books) {
  return useMemo(() => {
    const total = books.length;
    const owned = books.filter((book) => book.status === 'milik').length;
    const reading = books.filter((book) => book.status === 'baca').length;
    const toBuy = books.filter((book) => book.status === 'beli').length;
    return { total, owned, reading, toBuy };
  }, [books]);
}

useBookStats.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired
  })).isRequired
};
