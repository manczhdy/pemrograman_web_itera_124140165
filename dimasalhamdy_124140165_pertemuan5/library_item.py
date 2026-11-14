"""Modul library_item.py

Berisi definisi kelas-kelas yang merepresentasikan item pada perpustakaan.

Konsep OOP yang ditunjukkan:
- Abstract class (ABC): `LibraryItem` sebagai kelas dasar abstrak.
- Abstract method: `get_detail()` dan `hitung_denda()`.
- Inheritance: `Book` dan `Magazine` mewarisi `LibraryItem`.
- Polymorphism: `get_detail()` dan `hitung_denda()` diimplementasikan
  berbeda pada setiap subclass.
- Encapsulation: atribut `__id`, `__dipinjam`, `_judul`, dan `_penerbit`.
- Property: `is_dipinjam` yang didukung atribut privat `__dipinjam`.
"""

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """Kelas abstrak dasar untuk semua item perpustakaan.

    Atribut:
        __id (str): identitas unik item (privat).
        _judul (str): judul item (terlindungi/protected).
        _penerbit (str): nama penerbit (terlindungi/protected).
        __dipinjam (bool): status pinjam item (privat).
    """

    def __init__(self, id_item: str, judul: str, penerbit: str) -> None:
        """Membuat item perpustakaan baru.

        Args:
            id_item: identitas unik item.
            judul: judul item.
            penerbit: nama penerbit item.
        """
        self.__id = id_item            # encapsulation: atribut privat
        self._judul = judul            # encapsulation: atribut terlindungi
        self._penerbit = penerbit      # encapsulation: atribut terlindungi
        self.__dipinjam = False        # encapsulation: status pinjam privat

    # ---------- property: status pinjam ----------
    @property
    def is_dipinjam(self) -> bool:
        """Mengembalikan status pinjam (True jika sedang dipinjam)."""
        return self.__dipinjam

    @is_dipinjam.setter
    def is_dipinjam(self, status: bool) -> None:
        """Mengubah status pinjam item.

        Args:
            status: True jika item dipinjam, False jika dikembalikan.
        """
        self.__dipinjam = bool(status)

    # ---------- property: akses baca id ----------
    @property
    def id_item(self) -> str:
        """Mengembalikan identitas unik item (read-only)."""
        return self.__id

    @property
    def judul(self) -> str:
        """Mengembalikan judul item (read-only)."""
        return self._judul

    # ---------- abstract method ----------
    @abstractmethod
    def get_detail(self) -> str:
        """Mengembalikan detail item dalam bentuk string.

        Wajib diimplementasikan oleh setiap subclass (polymorphism).
        """
        raise NotImplementedError

    @abstractmethod
    def hitung_denda(self, hari_terlambat: int) -> int:
        """Menghitung denda keterlambatan pengembalian.

        Wajib diimplementasikan oleh setiap subclass (polymorphism).

        Args:
            hari_terlambat: jumlah hari keterlambatan.

        Returns:
            Besar denda dalam Rupiah.
        """
        raise NotImplementedError


class Book(LibraryItem):
    """Subclass `LibraryItem` untuk buku.

    Menambah atribut `_penulis` dan `_jumlah_halaman`.
    """

    def __init__(
        self,
        id_item: str,
        judul: str,
        penulis: str,
        penerbit: str,
        jumlah_halaman: int,
    ) -> None:
        """Membuat objek buku baru.

        Args:
            id_item: identitas unik buku.
            judul: judul buku.
            penulis: nama penulis buku.
            penerbit: nama penerbit buku.
            jumlah_halaman: banyak halaman buku.
        """
        super().__init__(id_item, judul, penerbit)  # inheritance
        self._penulis = penulis
        self._jumlah_halaman = jumlah_halaman

    def get_detail(self) -> str:
        """Mengembalikan detail buku (implementasi abstract method)."""
        return (
            f"[Buku]    ID: {self.id_item} | Judul: {self._judul} | "
            f"Penulis: {self._penulis} | Penerbit: {self._penerbit} | "
            f"{self._jumlah_halaman} halaman"
        )

    def hitung_denda(self, hari_terlambat: int) -> int:
        """Menghitung denda buku: Rp 1.000 per hari keterlambatan."""
        return hari_terlambat * 1000


class Magazine(LibraryItem):
    """Subclass `LibraryItem` untuk majalah.

    Menambah atribut `_edisi`.
    """

    def __init__(
        self,
        id_item: str,
        judul: str,
        edisi: str,
        penerbit: str,
    ) -> None:
        """Membuat objek majalah baru.

        Args:
            id_item: identitas unik majalah.
            judul: judul majalah.
            edisi: nomor/edisi terbit majalah.
            penerbit: nama penerbit majalah.
        """
        super().__init__(id_item, judul, penerbit)  # inheritance
        self._edisi = edisi

    def get_detail(self) -> str:
        """Mengembalikan detail majalah (implementasi abstract method)."""
        return (
            f"[Majalah] ID: {self.id_item} | Judul: {self._judul} | "
            f"Edisi: {self._edisi} | Penerbit: {self._penerbit}"
        )

    def hitung_denda(self, hari_terlambat: int) -> int:
        """Menghitung denda majalah: Rp 500 per hari keterlambatan."""
        return hari_terlambat * 500
