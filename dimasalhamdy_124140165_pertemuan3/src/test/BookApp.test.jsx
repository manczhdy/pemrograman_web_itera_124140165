import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

function renderApp(path = '/') {
  window.history.pushState({}, 'Test page', path);
  return render(<App />);
}

describe('Aplikasi Manajemen Buku Pribadi', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, 'Test page', '/');
  });

  it('menampilkan halaman utama dan form buku', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: 'Catat buku yang dimiliki, sedang dibaca, dan ingin dibeli' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Judul buku/i)).toBeInTheDocument();
  });

  it('memvalidasi judul dan penulis wajib diisi', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Tambah Buku' }));
    expect(screen.getByText('Judul buku wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Nama penulis wajib diisi.')).toBeInTheDocument();
  });

  it('menambah buku dengan status yang dipilih', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.type(screen.getByLabelText(/Judul buku/i), 'Laskar Pelangi');
    await user.type(screen.getByLabelText(/^Nama penulis/i), 'Andrea Hirata');
    await user.selectOptions(screen.getByLabelText('Status buku'), 'baca');
    await user.click(screen.getByRole('button', { name: 'Tambah Buku' }));
    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument();
    expect(screen.getByText('oleh Andrea Hirata')).toBeInTheDocument();
    expect(screen.getByText('Sedang dibaca')).toBeInTheDocument();
  });

  it('mencari buku berdasarkan nama penulis', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.type(screen.getByLabelText(/Judul buku/i), 'Bumi');
    await user.type(screen.getByLabelText(/Nama penulis/i), 'Tere Liye');
    await user.click(screen.getByRole('button', { name: 'Tambah Buku' }));
    await user.type(screen.getByRole('searchbox', { name: /Cari judul/i }), 'tere');
    expect(screen.getByText('Bumi')).toBeInTheDocument();
  });

  it('menampilkan halaman statistik dan ringkasan kategori', () => {
    window.localStorage.setItem('personal_books_v1', JSON.stringify([
      { id: '1', title: 'Buku A', author: 'Penulis A', status: 'milik' },
      { id: '2', title: 'Buku B', author: 'Penulis B', status: 'baca' },
      { id: '3', title: 'Buku C', author: 'Penulis C', status: 'beli' }
    ]));
    renderApp('/stats');
    expect(screen.getByRole('heading', { name: 'Statistik Buku' })).toBeInTheDocument();
    expect(screen.getByText('Total buku')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
