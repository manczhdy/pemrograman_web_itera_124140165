import React from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../../context/BookContext';
import useBookStats from '../../hooks/useBookStats';
import './Stats.css';

const STATUS = [
  { key: 'owned', label: 'Milik saya', cls: '' },
  { key: 'reading', label: 'Sedang dibaca', cls: 'baca' },
  { key: 'toBuy', label: 'Ingin dibeli', cls: 'beli' }
];

function Stats() {
  const { books } = useBooks();
  const stats = useBookStats(books);
  const cards = [
    ['Total buku', stats.total, 'Seluruh koleksi'],
    ['Milik saya', stats.owned, 'Buku yang sudah dimiliki'],
    ['Sedang dibaca', stats.reading, 'Buku dalam proses dibaca'],
    ['Ingin dibeli', stats.toBuy, 'Buku dalam daftar keinginan']
  ];

  return <main className="page">
    <div className="page-heading"><div><h2>Statistik Buku</h2>
      <p>Lihat ringkasan koleksi buku pribadi berdasarkan statusnya.</p></div>
      <Link to="/" className="button button-secondary">Kembali ke Rak Buku</Link></div>
    <section className="stats-grid" aria-label="Ringkasan statistik buku">
      {cards.map(([label, value, detail]) => <article className="stat-card" key={label}>
        <p>{label}</p><strong>{value}</strong><small>{detail}</small></article>)}
    </section>
    <section className="panel progress-section"><h3>Distribusi Status Buku</h3>
      {STATUS.map((item) => {
        const count = stats[item.key];
        const percentage = stats.total ? Math.round(count / stats.total * 100) : 0;
        return <div className="progress-item" key={item.key}>
          <div className="progress-label"><span>{item.label}</span><span>{count} buku · {percentage}%</span></div>
          <div className="progress-track" role="progressbar" aria-label={item.label} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percentage}>
            <div className={`progress-fill ${item.cls}`} style={{ width: `${percentage}%` }} /></div>
        </div>;
      })}
    </section>
  </main>;
}
export default Stats;
