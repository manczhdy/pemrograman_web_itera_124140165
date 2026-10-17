# Tugas PRAKTIKUM 2

# Identitas
- Nama:  Dimas Alhamdy
- NIM:   124140165
- KELAS: RB

# Deskripsi Aplikasi
Aplikasi ini merupakan penerapan next gen js dengan menggunakan pencatatan tugas sederhana sebagai implementasi

# Fitur
Fitur yang dimiliki oleh website ini adalah
- [X] Daftar Status Tugas
    - Terdapat pencatat jumlah tugas dan status sebuah tugas apakah jika sudah diselesaikan atau belum.
- [x] Menambahkan Tugas 
    - Terdapat form untuk menambahkan tugas dengan menuliskan Judul Tugas.
- [x] Menambahkan Tenggat waktu
    - Terdapat form untuk menuliskan tenggat waktu.
- [x] Daftar Tugas
    - Setelah judul tugas dan tenggat waktu ditambahkan maka daftar tugas akan ditampilkan dalam bentuk list.
- [x] Tombol selesai
    - Apabila tugas telah selesai maka terdapat tombol yang dapat langsung mencoret judul tugas.
- [X] Tombol Edit
    - Apabila terdapat kesalahan maupun perubahan baik pada judul atau tenggat maka terdapat tombol edit untuk melakukan perubahan.
- [X] Tombol Hapus
    - Apabila Tugas Telah dikerjakan dan ingin dihapuskan untuk memudahkan membaca tugas baru maka terdapat tombol hapus untuk melakukan hal tersebut.

# Panduan Pakai
 1. Pasikan Anda memiliki semua folder dan file yang dibutuhkan 
 2. Pastikan Anda mempunyai Extension Live Server
    Jika anda tidak mempunyainya 
        1. cari tab Extension pada sebelah kiri panel
        2. Lalu cari Extension Live Server
        3. Klik Install
        4. Setelah terpasang, klik kanan pada file index.html
        5. Pilih Open With Live Server, maka browser akan otomatis terbuka

# Screenshot Tampilan
1. Tampilan Utama
![Tampilan-Utama](Screenshots/Tampilan-Utama.png)

2. Tampilan Status Tugas
![Tampilan-Status-Tugas](Screenshots/Status-Tugas.png)

3. Tampilan Form Tambah Tugas dan Deadline
![Tampilan-Tambah-Tugas](Screenshots/Form-Tambah-Tugas.png)

4. Tampilan Daftar Tugas
![Tampilan-Daftar-Tugas](Screenshots/Daftar-Tugas.png)

# Fitur ES6+
| Materi | File | Lokasi |
| :--- | :--- | :--- |
| `let` dan `const` | `js/app.js`, `js/modules/utils.js`, `js/modules/data.js` |  `app.js` (baris 27, 30, 34, 48, 86-88, 124, 148), `utils.js` (baris 3, 20-22), `data.js` (baris 12, 15) |
| Arrow functions | `js/modules/utils.js`, `js/app.js`, `js/modules/data.js`, `js/main.js` | `utils.js` (baris 1, 8, 14, 19, 21, 27); `app.js` (baris 22, 23, 31, 61, 70, 76, 102, 147, 174-184); `data.js` (baris 10, 17); `main.js` (baris 4) |
| Template literals | `js/app.js`, `js/modules/utils.js` | `renderStats` (`app.js` baris 126-138), `renderTaskList` (`app.js` baris 152-167), `generateUniqueId` (`utils.js` baris 28) |
| Destructuring | `js/app.js`, `js/modules/data.js` | `app.js` (baris 47, 60, 124, 147); `data.js` (baris 2) |
| Spread | `js/app.js` | `[...apiTasks]` (baris 35), `[newTask, ...this.#tasks]` (baris 55), `{ ...task, title, deadline }` (baris 62), `{ ...task, completed: !task.completed }` (baris 77) |
| Classes | `js/modules/data.js`, `js/app.js` | `TaskItem` (`data.js` baris 1), `DashboardApp` (`app.js` baris 4) |
| Array methods | `js/app.js`, `js/modules/utils.js`, `js/modules/data.js` | `map` (`app.js` baris 31, 61, 76, 147; `data.js` baris 17), `filter` (`app.js` baris 70; `utils.js` baris 21), `find` (`app.js` baris 102), `forEach` (`app.js` baris 174, 178, 182) |
| Async/await | `js/modules/data.js`, `js/app.js` | `fetchInitialTasks` (`data.js` baris 10, 12, 15), `init` (`app.js` baris 26, 34) |
| ES Modules | `js/main.js`, `js/app.js`, `js/modules/data.js`, `js/modules/utils.js`, `index.html` | `import` / `export` di semua file JS; `<script type="module" src="js/main.js"></script>` di `index.html` (baris 68) |