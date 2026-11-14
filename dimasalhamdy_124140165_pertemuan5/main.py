"""Program utama Sistem Manajemen Perpustakaan Sederhana.

Modul ini menguji seluruh fungsionalitas yang disediakan oleh
`library_item.py` dan `library.py`, meliputi:
- Pembuatan objek `Library`.
- Penambahan item `Book` dan `Magazine` (inheritance + polymorphism).
- Menampilkan katalog item yang tersedia.
- Pencarian berdasarkan judul dan id (termasuk kasus tidak ditemukan).
- Mengubah status pinjam melalui property `is_dipinjam` (encapsulation).
- Menghitung denda keterlambatan (abstract method terpolimorfik).
"""

from library_item import Book, Magazine
from library import Library


def garis(tanda: str = "=") -> None:
    """Mencetak garis pemisah sepanjang 72 karakter."""
    print(tanda * 72)


def main() -> None:
    """Menjalankan seluruh demonstrasi sistem perpustakaan."""
    # ============================================================
    # 1. Membuat perpustakaan
    # ============================================================
    garis()
    print("   SISTEM MANAJEMEN PERPUSTAKAAN SEDERHANA")
    print("   Konsep OOP: class, inheritance, encapsulation, polymorphism")
    garis()

    perpustakaan = Library("Perpustakaan Pusat")
    print(f"\nPerpustakaan dibuat: '{perpustakaan.nama}'")

    # ============================================================
    # 2. Menambahkan item (Book dan Magazine)
    # ============================================================
    print("\n[1] Menambahkan item ke koleksi:")
    garis("-")
    buku1 = Book("B001", "Laskar Pelangi", "Andrea Hirata", "Bentang Pustaka", 534)
    buku2 = Book("B002", "Bumi Manusia", "Pramoedya Ananta Toer", "Lentera", 535)
    majalah1 = Magazine("M001", "Tempo", "Edisi 45", "Tempo Inti Media")
    majalah2 = Magazine("M002", "National Geographic", "Edisi 120", "Kompas Gramedia")

    perpustakaan.tambah_item(buku1)
    perpustakaan.tambah_item(buku2)
    perpustakaan.tambah_item(majalah1)
    perpustakaan.tambah_item(majalah2)

    # ============================================================
    # 3. Menampilkan katalog item yang tersedia
    # ============================================================
    print("\n[2] Menampilkan katalog item yang tersedia:")
    perpustakaan.tampilkan_katalog()

    # ============================================================
    # 4. Mencari item berdasarkan judul dan id
    # ============================================================
    print("\n[3] Pencarian item:")
    garis("-")
    perpustakaan.cari("Laskar")      # pencarian berdasarkan judul
    perpustakaan.cari("M001")        # pencarian berdasarkan id
    perpustakaan.cari("Python")      # kasus tidak ditemukan

    # ============================================================
    # 5. Mengubah status pinjam melalui property is_dipinjam
    # ============================================================
    print("\n[4] Demonstrasi status pinjam (property is_dipinjam):")
    garis("-")

    print(f"  Sebelum dipinjam -> is_dipinjam: {buku1.is_dipinjam}")
    buku1.is_dipinjam = True          # memanggil setter
    print(f"  Setelah dipinjam -> is_dipinjam: {buku1.is_dipinjam}")
    buku1.is_dipinjam = False         # memanggil setter (kembalikan)
    print(f"  Setelah dikembalikan -> is_dipinjam: {buku1.is_dipinjam}")

    # ============================================================
    # 6. Menghitung denda keterlambatan (polymorphism)
    # ============================================================
    print("\n[5] Demonstrasi denda keterlambatan (polymorphism):")
    garis("-")
    hari = 3
    print(
        f"  Denda buku '{buku1.judul}' terlambat {hari} hari: "
        f"Rp {buku1.hitung_denda(hari):,}"
    )
    print(
        f"  Denda majalah '{majalah2.judul}' terlambat {hari} hari: "
        f"Rp {majalah2.hitung_denda(hari):,}"
    )

    # ============================================================
    # 7. Menampilkan katalog akhir
    # ============================================================
    print("\n[6] Katalog akhir (semua item masih tersedia):")
    perpustakaan.tampilkan_katalog()

    print("\n  Seluruh fungsionalitas berhasil diuji.")
    garis()


if __name__ == "__main__":
    main()
