## Identitas Diri
Nama: Dimas Alhamdy <br>
NIM: 124140165 <br>
Kelas: RB

## Deskripsi Aplikasi

Aplikasi ini adalah **RESTful API Manajemen Data Mahasiswa dan Matakuliah**
yang dibangun dengan **Pyramid 2.1**, **SQLAlchemy 2.1**, **Alembic**, dan
**PostgreSQL 19**. Seluruh endpoint mengembalikan data **JSON** dan mendukung
operasi CRUD lengkap (Create, Read, Update, Delete) untuk dua resource:

- **Mahasiswa** — `nim`, `nama`, `jurusan`, `tanggal_lahir`, dan `alamat`.
- **Matakuliah** — `kode_mk`, `nama_mk`, `sks`, dan `semester`.

Fitur utama:

- Lima endpoint REST untuk masing-masing resource dengan predikat
  `request_method` pada `routes.py`.
- Validasi input: field wajib, tipe data, tanggal ISO, `sks`/`semester`
  harus bilangan bulat lebih dari 0, serta penolakan `nim`/`kode_mk`
  duplikat.
- Status code sesuai kebutuhan: **200** untuk operasi berhasil, **400**
  untuk request tidak valid, dan **404** untuk data yang tidak ditemukan.
- Migrasi skema database dengan Alembic dan seeding data awal yang
  idempotent.
- Pemisahan lapisan model (`models/`), view (`views/`), routing
  (`routes.py`), dan skrip database (`scripts/`).

## Struktur Direktori

```text
dimasalhamdy_124140165_pertemuan6/
├── development.ini
├── production.ini
├── setup.py
├── README.md
├── .gitignore
├── Screenshots/
│   ├── 01_mahasiswa_get_all.png
│   ├── 02_mahasiswa_get_detail.png
│   ├── 03_mahasiswa_create.png
│   ├── 04_mahasiswa_validation_400.png
│   ├── 05_mahasiswa_update.png
│   ├── 06_mahasiswa_delete.png
│   ├── 07_mahasiswa_not_found_404.png
│   ├── 08_matakuliah_get_all.png
│   ├── 09_matakuliah_get_detail.png
│   ├── 10_matakuliah_create.png
│   ├── 11_matakuliah_validation_400.png
│   ├── 12_matakuliah_duplicate_400.png
│   ├── 13_matakuliah_update.png
│   ├── 14_matakuliah_delete.png
│   └── 15_matakuliah_not_found_404.png
└── pyramid_mahasiswa/
    ├── __init__.py
    ├── routes.py
    ├── alembic/
    │   ├── env.py
    │   ├── script.py.mako
    │   └── versions/
    │       ├── 811f8283c6a6_create_mahasiswa_table.py
    │       └── eebb8cdbcf17_create_matakuliah_table.py
    ├── models/
    │   ├── __init__.py
    │   ├── meta.py
    │   ├── mahasiswa.py
    │   └── matakuliah.py
    ├── scripts/
    │   ├── __init__.py
    │   └── initialize_db.py
    ├── static/
    └── views/
        ├── __init__.py
        ├── default.py
        ├── mahasiswa.py
        └── matakuliah.py
```

Folder `venv/`, `__pycache__/`, file `*.pyc`, `*.egg-info/`, dan `.env`
tidak diunggah ke repositori karena sudah tercantum pada `.gitignore`.

## Instalasi

Seluruh perintah di bawah dijalankan dari **root folder pertemuan6**
(folder yang sejajar dengan `development.ini`).

1. Buka folder proyek:

   ```powershell
   cd dimasalhamdy_124140165_pertemuan6
   ```

2. Buat virtual environment (cukup sekali):

   ```powershell
   python -m venv venv
   ```

3. Aktifkan virtual environment:

   ```powershell
   # PowerShell
   .\venv\Scripts\Activate.ps1

   # Command Prompt (cmd.exe)
   venv\Scripts\activate.bat
   ```

   Jika PowerShell menolak menjalankan script aktivasi, jalankan sekali:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. Perbarui pip dan setuptools, lalu pasang aplikasi dalam mode editable
   beserta dependensi pengujian:

   ```powershell
   python -m pip install --upgrade pip setuptools
   pip install -e ".[testing]"
   ```

   Perintah tersebut membaca `setup.py`, sehingga **Pyramid**,
   **SQLAlchemy**, **Alembic**, **pyramid_tm**, **zope.sqlalchemy**,
   **waitress**, **pyramid_debugtoolbar**, dan **psycopg2-binary** ikut
   terpasang. Tidak perlu memasang `psycopg2-binary` secara terpisah.

5. Siapkan database dan role PostgreSQL. Masuk ke psql sebagai superuser:

   ```powershell
   psql -U postgres
   ```

   Jika `psql` belum ada di `PATH` (misalnya instalasi PostgreSQL di
   `D:\PostgreSQL\19`), gunakan path lengkap:

   ```powershell
   & "D:\PostgreSQL\19\bin\psql.exe" -U postgres
   ```

   Setelah prompt `postgres=#` muncul, jalankan SQL berikut:

   ```sql
   CREATE DATABASE pyramid_mahasiswa;
   CREATE USER pyramid_user WITH ENCRYPTED PASSWORD 'pyramid_pass';
   GRANT ALL PRIVILEGES ON DATABASE pyramid_mahasiswa TO pyramid_user;

   -- PostgreSQL 15 ke atas: beri izin pada schema public
   \c pyramid_mahasiswa
   GRANT ALL ON SCHEMA public TO pyramid_user;
   \q
   ```

   Jika database/role sudah pernah dibuat, lewati langkah `CREATE` agar
   tidak muncul error "already exists". Kredensial di atas hanya untuk
   praktikum lokal.

6. Periksa koneksi database pada `development.ini`:

   ```ini
   sqlalchemy.url = postgresql+psycopg2://pyramid_user:pyramid_pass@localhost:5432/pyramid_mahasiswa
   ```

   Kualifikasi **`+psycopg2`** wajib ditulis karena SQLAlchemy 2.1
   menggunakan driver **psycopg v3** sebagai default untuk URL
   `postgresql://`, sedangkan proyek ini memasang **psycopg2-binary**.
   Tanpa kualifikasi tersebut, SQLAlchemy akan mencoba mengimpor `psycopg`
   dan gagal. Jika ingin memakai psycopg v3, pasang `psycopg[binary]` dan
   tulis URL dengan `postgresql+psycopg://`.

## Migrasi Database

Pastikan virtual environment aktif dan posisi terminal berada di root
folder pertemuan6. Terapkan seluruh revisi Alembic ke database:

```powershell
alembic -c development.ini upgrade head
```

Revisi yang tersedia:

| Revisi | Deskripsi |
| --- | --- |
| `811f8283c6a6` | Membuat tabel `mahasiswa` |
| `eebb8cdbcf17` | Membuat tabel `matakuliah` (lanjutan revisi di atas) |

Revisi dibuat dengan perintah autogenerate berikut, lalu dijalankan
migrasinya:

```powershell
# Revisi tabel mahasiswa
alembic -c development.ini revision --autogenerate -m "create mahasiswa table"
alembic -c development.ini upgrade head

# Revisi tabel matakuliah
alembic -c development.ini revision --autogenerate -m "create matakuliah table"
alembic -c development.ini upgrade head
```

Perintah bantu untuk memeriksa versi migrasi:

```powershell
alembic -c development.ini current
alembic -c development.ini history
```

Setelah skema terbentuk, jalankan seeding data awal:

```powershell
python -m pyramid_mahasiswa.scripts.initialize_db development.ini
```

Script seeding bersifat **idempotent**: data yang sudah ada dilewati,
sehingga aman dijalankan berulang kali. Pada database kosong, output
pertamanya adalah:

```text
Seeding selesai: 2 mahasiswa baru dan 3 matakuliah baru ditambahkan.
Berhasil memasukkan data seeding awal (data yang sudah ada dilewati)!
```

Data awal yang diharapkan:

| Tabel | Data |
| --- | --- |
| `mahasiswa` | Budi Santoso (NIM `12345`), Siti Aminah (NIM `54321`) |
| `matakuliah` | IF2110 Pemrograman Web (3 sks, semester 3), IF3140 Basis Data (3 sks, semester 5), IF2010 Struktur Data (4 sks, semester 3) |

## Menjalankan Server

Jalankan server development Waitress dengan auto-reload:

```powershell
pserve development.ini --reload
```

Server mendengarkan di:

- http://localhost:6543
- http://127.0.0.1:6543

Halaman root `/` mengembalikan JSON berisi pesan selamat datang dan daftar
endpoint. `pyramid_debugtoolbar` aktif pada `development.ini`, tetapi hanya
muncul untuk request dari `localhost` dan tidak mengubah respons JSON API.
Hentikan server dengan `Ctrl+C`.

## Endpoint API

### Mahasiswa

| Method | Endpoint | Deskripsi | Sukses | Error |
| --- | --- | --- | --- | --- |
| `GET` | `/api/mahasiswa` | Menampilkan seluruh mahasiswa | 200 | — |
| `GET` | `/api/mahasiswa/{id}` | Menampilkan detail mahasiswa | 200 | 404 jika ID tidak ada |
| `POST` | `/api/mahasiswa` | Menambahkan mahasiswa baru | 200 | 400 jika data tidak valid/duplikat |
| `PUT` | `/api/mahasiswa/{id}` | Memperbarui data mahasiswa (partial update) | 200 | 400 jika data tidak valid/duplikat, 404 jika ID tidak ada |
| `DELETE` | `/api/mahasiswa/{id}` | Menghapus mahasiswa | 200 | 404 jika ID tidak ada |

Field wajib saat `POST`: `nim`, `nama`, `jurusan`. Field opsional:
`tanggal_lahir` (format `YYYY-MM-DD`) dan `alamat`. NIM harus unik.

### Matakuliah

| Method | Endpoint | Deskripsi | Sukses | Error |
| --- | --- | --- | --- | --- |
| `GET` | `/api/matakuliah` | Menampilkan seluruh matakuliah | 200 | — |
| `GET` | `/api/matakuliah/{id}` | Menampilkan detail matakuliah | 200 | 404 jika ID tidak ada |
| `POST` | `/api/matakuliah` | Menambahkan matakuliah baru | 200 | 400 jika data tidak valid/duplikat |
| `PUT` | `/api/matakuliah/{id}` | Memperbarui data matakuliah (partial update) | 200 | 400 jika data tidak valid/duplikat, 404 jika ID tidak ada |
| `DELETE` | `/api/matakuliah/{id}` | Menghapus matakuliah | 200 | 404 jika ID tidak ada |

Field wajib saat `POST`: `kode_mk`, `nama_mk`, `sks`, `semester`.
`kode_mk` harus unik, sedangkan `sks` dan `semester` harus bilangan bulat
lebih dari 0 (divalidasi di view dan juga oleh `CheckConstraint` di
database).

## Contoh Pengujian cURL

Perintah di bawah ditulis untuk **PowerShell di Windows** dan menggunakan
`curl.exe` (bukan alias `curl` yang mengarah ke `Invoke-WebRequest`).
Karena PowerShell 5.1 menghapus tanda kutip di dalam argumen native,
tanda kutip ganda pada body JSON di-escape dengan backslash (`\"`). Jika
memakai Git Bash/WSL, gunakan kutip tunggal tanpa escape, misalnya
`-d '{"nim": "67890"}'`.

Jalankan server terlebih dahulu di terminal lain. ID pada contoh `PUT`
dan `DELETE` mengikuti ID yang dikembalikan oleh respons `POST`; sesuaikan
bila database Anda sudah memiliki data lain.

### Mahasiswa

```powershell
# 1. READ ALL - 200 OK
curl.exe -s -i -X GET http://localhost:6543/api/mahasiswa

# 2. READ ONE - 200 OK
curl.exe -s -i -X GET http://localhost:6543/api/mahasiswa/1

# 3. CREATE - 200 OK (contoh menghasilkan id 3)
curl.exe -s -i -X POST http://localhost:6543/api/mahasiswa -H "Content-Type: application/json" -d '{\"nim\": \"67890\", \"nama\": \"Ahmad Fadli\", \"jurusan\": \"Teknik Elektro\", \"tanggal_lahir\": \"2001-11-05\", \"alamat\": \"Jl. Mawar No. 10, Surabaya\"}'

# 4. UPDATE - 200 OK
curl.exe -s -i -X PUT http://localhost:6543/api/mahasiswa/3 -H "Content-Type: application/json" -d '{\"jurusan\": \"Teknik Informatika\", \"alamat\": \"Jl. Dipati Ukur No. 88, Bandung\"}'

# 5. DELETE - 200 OK
curl.exe -s -i -X DELETE http://localhost:6543/api/mahasiswa/3

# 6. NOT FOUND - 404 Not Found
curl.exe -s -i -X GET http://localhost:6543/api/mahasiswa/3

# 7. VALIDASI - 400 Bad Request (field nim tidak dikirim)
curl.exe -s -i -X POST http://localhost:6543/api/mahasiswa -H "Content-Type: application/json" -d '{\"nama\": \"Mahasiswa Tanpa NIM\", \"jurusan\": \"Informatika\"}'
```

Contoh respons `GET /api/mahasiswa`:

```json
{
  "mahasiswas": [
    {
      "id": 1,
      "nim": "12345",
      "nama": "Budi Santoso",
      "jurusan": "Teknik Informatika",
      "tanggal_lahir": "2000-05-15",
      "alamat": "Jl. Merdeka No. 123, Bandung"
    },
    {
      "id": 2,
      "nim": "54321",
      "nama": "Siti Aminah",
      "jurusan": "Sistem Informasi",
      "tanggal_lahir": "2001-08-22",
      "alamat": "Jl. Mawar No. 45, Jakarta"
    }
  ]
}
```

### Matakuliah

```powershell
# 1. READ ALL - 200 OK
curl.exe -s -i -X GET http://localhost:6543/api/matakuliah

# 2. READ ONE - 200 OK
curl.exe -s -i -X GET http://localhost:6543/api/matakuliah/1

# 3. CREATE - 200 OK (contoh menghasilkan id 4)
curl.exe -s -i -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d '{\"kode_mk\": \"IF4000\", \"nama_mk\": \"Algoritma\", \"sks\": 3, \"semester\": 4}'

# 4. UPDATE - 200 OK
curl.exe -s -i -X PUT http://localhost:6543/api/matakuliah/4 -H "Content-Type: application/json" -d '{\"nama_mk\": \"Algoritma dan Struktur Data\", \"sks\": 4, \"semester\": 5}'

# 5. DELETE - 200 OK
curl.exe -s -i -X DELETE http://localhost:6543/api/matakuliah/4

# 6. NOT FOUND - 404 Not Found
curl.exe -s -i -X GET http://localhost:6543/api/matakuliah/4

# 7. VALIDASI - 400 Bad Request (sks harus > 0)
curl.exe -s -i -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d '{\"kode_mk\": \"IF4001\", \"nama_mk\": \"Algoritma Lanjut\", \"sks\": 0, \"semester\": 4}'

# 8. DUPLIKAT - 400 Bad Request (kode_mk IF2110 sudah ada)
curl.exe -s -i -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d '{\"kode_mk\": \"IF2110\", \"nama_mk\": \"Pemrograman Web Lanjut\", \"sks\": 3, \"semester\": 4}'
```

Contoh respons `GET /api/matakuliah`:

```json
{
  "matakuliahs": [
    {
      "id": 1,
      "kode_mk": "IF2110",
      "nama_mk": "Pemrograman Web",
      "sks": 3,
      "semester": 3
    },
    {
      "id": 2,
      "kode_mk": "IF3140",
      "nama_mk": "Basis Data",
      "sks": 3,
      "semester": 5
    },
    {
      "id": 3,
      "kode_mk": "IF2010",
      "nama_mk": "Struktur Data",
      "sks": 4,
      "semester": 3
    }
  ]
}
```

## Screenshots

Gambar di bawah adalah **transcript terminal yang dirender dari keluaran
asli** perintah cURL di atas terhadap server yang benar-benar berjalan di
`localhost:6543` (bukan tangkapan jendela). Setiap gambar menampilkan
perintah, status HTTP, header, dan body respons apa adanya.

1. **GET `/api/mahasiswa`** — 200 OK, menampilkan 2 data seed (Budi Santoso dan Siti Aminah).
   ![GET semua mahasiswa](Screenshots/01_mahasiswa_get_all.png)

2. **GET `/api/mahasiswa/1`** — 200 OK, detail Budi Santoso.
   ![GET detail mahasiswa](Screenshots/02_mahasiswa_get_detail.png)

3. **POST `/api/mahasiswa`** — 200 OK, mahasiswa baru Ahmad Fadli (NIM 67890) memperoleh `id` 3.
   ![POST mahasiswa](Screenshots/03_mahasiswa_create.png)

4. **POST `/api/mahasiswa` tanpa `nim`** — 400 Bad Request, `{"error":"Field nim wajib diisi!"}`.
   ![Validasi 400 mahasiswa](Screenshots/04_mahasiswa_validation_400.png)

5. **PUT `/api/mahasiswa/3`** — 200 OK, nama/jurusan/alamat berhasil diperbarui.
   ![PUT mahasiswa](Screenshots/05_mahasiswa_update.png)

6. **DELETE `/api/mahasiswa/3`** — 200 OK, data mahasiswa dihapus.
   ![DELETE mahasiswa](Screenshots/06_mahasiswa_delete.png)

7. **GET `/api/mahasiswa/3` setelah dihapus** — 404 Not Found, `{"error":"Mahasiswa dengan ID 3 tidak ditemukan"}`.
   ![404 mahasiswa](Screenshots/07_mahasiswa_not_found_404.png)

8. **GET `/api/matakuliah`** — 200 OK, menampilkan 3 data seed (IF2110, IF3140, IF2010).
   ![GET semua matakuliah](Screenshots/08_matakuliah_get_all.png)

9. **GET `/api/matakuliah/1`** — 200 OK, detail matakuliah IF2110 Pemrograman Web.
   ![GET detail matakuliah](Screenshots/09_matakuliah_get_detail.png)

10. **POST `/api/matakuliah`** — 200 OK, matakuliah IF4000 Algoritma (3 sks, semester 4) memperoleh `id` 4.
    ![POST matakuliah](Screenshots/10_matakuliah_create.png)

11. **POST `/api/matakuliah` dengan `sks` 0** — 400 Bad Request, `{"error":"Field sks harus berupa bilangan bulat lebih dari 0"}`.
    ![Validasi 400 matakuliah](Screenshots/11_matakuliah_validation_400.png)

12. **POST `/api/matakuliah` dengan `kode_mk` duplikat (IF2110)** — 400 Bad Request, `{"error":"Kode matakuliah IF2110 sudah terdaftar!"}`.
    ![Duplikat 400 matakuliah](Screenshots/12_matakuliah_duplicate_400.png)

13. **PUT `/api/matakuliah/4`** — 200 OK, nama menjadi Algoritma dan Struktur Data, `sks` 4, `semester` 5.
    ![PUT matakuliah](Screenshots/13_matakuliah_update.png)

14. **DELETE `/api/matakuliah/4`** — 200 OK, data matakuliah dihapus.
    ![DELETE matakuliah](Screenshots/14_matakuliah_delete.png)

15. **GET `/api/matakuliah/4` setelah dihapus** — 404 Not Found, `{"error":"Matakuliah dengan ID 4 tidak ditemukan"}`.
    ![404 matakuliah](Screenshots/15_matakuliah_not_found_404.png)

## Catatan

- `.gitignore` sudah mencakup `venv/`, `.venv/`, `__pycache__/`, `*.py[cod]`,
  `*.sqlite`, `*.sqlite3`, `.env`, `*.egg-info/`, cache pytest/coverage, dan
  cache editor. Folder `venv/` serta file `.env` tidak ikut di-commit.
- Tidak ada kredensial rahasia yang di-commit. Kredensial
  `pyramid_user`/`pyramid_pass` pada `development.ini` hanya untuk database
  praktikum lokal.
- Validasi input dilakukan sebelum objek ORM diubah, sehingga request
  `400` tidak meninggalkan perubahan setengah jadi. Jika terjadi
  `IntegrityError` (misalnya race condition duplikat), session di-rollback
  sebelum respons `400` dikembalikan.
- ID pada URL divalidasi sebagai bilangan bulat positif; ID non-angka
  dikembalikan sebagai `404` (bukan `500`).
- Pemeriksaan gaya kode: `ruff check pyramid_mahasiswa setup.py` lolos tanpa
  temuan.
- Server development berjalan di `localhost:6543`; hentikan dengan `Ctrl+C`
  setelah selesai menguji.
