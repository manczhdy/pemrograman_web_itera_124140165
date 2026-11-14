"""Modul library.py

Berisi kelas `Library` untuk mengelola koleksi item perpustakaan.

Konsep OOP yang ditunjukkan:
- Encapsulation: atribut koleksi disimpan pada atribut privat `__koleksi`
  dan nama perpustakaan pada `__nama`.
"""

from library_item import LibraryItem


class Library:
    """Kelas yang menyimpan dan mengelola koleksi item perpustakaan."""

    def __init__(self, nama: str) -> None:
        """Membuat perpustakaan dengan nama tertentu.

        Args:
            nama: nama perpustakaan.
        """
        self.__nama = nama
        self.__koleksi = []  # encapsulation: koleksi bersifat privat

    @property
    def nama(self) -> str:
        """Mengembalikan nama perpustakaan (read-only)."""
        return self.__nama

    def tambah_item(self, item: LibraryItem) -> None:
        """Menambahkan item baru ke dalam koleksi.

        Args:
            item: objek bertipe `LibraryItem` (atau turunannya).
        """
        self.__koleksi.append(item)
        print(f"  + Item ditambahkan: {item.get_detail()}")

    def tampilkan_katalog(self) -> list:
        """Menampilkan seluruh item yang tersedia (tidak sedang dipinjam).

        Returns:
            Daftar item yang berstatus tersedia.
        """
        tersedia = [item for item in self.__koleksi if not item.is_dipinjam]

        print("=" * 72)
        print(f"  KATALOG PERPUSTAKAAN '{self.__nama}' (tersedia)")
        print("=" * 72)
        if not tersedia:
            print("  (tidak ada item yang tersedia)")
        else:
            for item in tersedia:
                print(f"  * {item.get_detail()}")
        print(f"  Total item tersedia: {len(tersedia)} dari {len(self.__koleksi)}")
        print("=" * 72)
        return tersedia

    def cari(self, kata_kunci: str) -> list:
        """Mencari item berdasarkan judul atau id.

        Pencarian judul bersifat tidak peka huruf besar/kecil dan
        cocok sebagian (substring); pencarian id bersifat persis
        (tidak peka huruf besar/kecil).

        Args:
            kata_kunci: kata kunci pencarian (judul atau id).

        Returns:
            Daftar item yang cocok dengan kata kunci.
        """
        hasil = []
        kunci = kata_kunci.strip().lower()
        for item in self.__koleksi:
            cocok_judul = kunci in item.judul.lower()
            cocok_id = kunci == item.id_item.lower()
            if cocok_judul or cocok_id:
                hasil.append(item)

        print(f"\n  Hasil pencarian '{kata_kunci}':")
        if not hasil:
            print("  (tidak ditemukan)")
        else:
            for item in hasil:
                print(f"  * {item.get_detail()}")
        return hasil
