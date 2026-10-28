# Aplikasi Manajemen Buku Pribadi (Create React App)
Aplikasi untuk mengurus dan mengorganisir buku. Dibantu dengan mencatat, memantau dan mengelola koleksi pribadi secara teratur

## Menjalankan Proyek
1. Persiapkan Node.js(versi terbaru), diperiksa melalui node --version & npm --version
2. Pindah ke directory project.
3. Jalankan `npm install`.
4. Jalankan `npm start` untuk membuka aplikasi di mode pengembangan (`http://localhost:3000`).

## Screenshots
1. Tampilan utama
![Tampilan-Utama](Screenshots/Tampilan-Utama.png)

2. Tampilan Statistik
![Tampilan-Statistik](Screenshots/Tampilan-statistik.png)

3. Validasi Error
![Validasi-Error](Screenshots/Validasi-error.png)

## Fitur React yang Digunakan
- **React Hooks Inti**
  - `useState`: Mengelola *state* lokal seperti nilai input form, pesan kesalahan (*errors*), status *touched*, pencarian, dan pilihan filter[cite: 39, 43].
  - `useEffect`: Menangani *side effect* untuk menyinkronkan data ke `localStorage` dan memperbarui formulir saat masuk ke mode edit[cite: 33, 43].
  - `useMemo`: Mengoptimalkan performa dengan memetakan kalkulasi statistik dan hasil pemfilteran buku agar tidak dihitung ulang secara tidak perlu[cite: 34, 35, 39].
  - `useContext`: Membaca dan mengonsumsi data *state global* dari `BookContext` secara langsung di dalam komponen[cite: 35].

- **Custom Hooks (Hook Buatan)**
  - `useLocalStorage`: Mengabstraksi pembacaan dan penulisan data secara otomatis ke `window.localStorage`[cite: 33].
  - `useBookStats`: Menghitung kalkulasi data agregat (total buku, status milik, sedang dibaca, dan ingin dibeli)[cite: 34].
  - `useBooks`: Mempermudah akses ke fungsi-fungsi `BookContext`[cite: 35].

- **Context API (`createContext` & `Provider`)**
  - Mengelola *state global* untuk data buku dan fungsi pencatatan (tambah, edit, hapus) tanpa perlu melakukan *prop drilling*[cite: 35].

- **Controlled Components (Komponen Terkontrol)**
  - Menangani seluruh elemen formulir (`<input>` dan `<select>`) dengan *state* React sebagai satu-satunya sumber kebenaran (*single source of truth*)[cite: 43, 45].

- **PropTypes (Validasi Props)**
  - Memastikan pemeriksaan tipe data *props* pada komponen (`PropTypes.shape`, `PropTypes.func`, `PropTypes.arrayOf`, dll.) untuk menjaga kestabilan aplikasi[cite: 34, 35, 41, 43, 45].

- **Integrasi React Router DOM**
  - Memanfaatkan `BrowserRouter`, `Routes`, `Route`, `NavLink`, dan `Navigate` untuk navigasi antarhalaman (*Single Page Application*)[cite: 28].