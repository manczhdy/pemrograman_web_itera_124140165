# Cara 1: mengimpor seluruh modul
import math_operations

# Cara 2: mengimpor fungsi-fungsi tertentu secara langsung
from math_operations import (
    luas_lingkaran,
    keliling_lingkaran,
    celsius_ke_fahrenheit,
    celsius_ke_kelvin,
)


def garis(tanda="="):
    print(tanda * 60)


# ============================================================
# Header
# ============================================================
garis()
print("   PROGRAM PERHITUNGAN MATEMATIKA (Pemanggil Modul)")
print("   Sumber: math_operations.py")
garis()
print(f"Konstanta PI dari modul : {math_operations.PI}")

# ============================================================
# A. Bentuk Geometri
# ============================================================
print()
garis("-")
print("A. LUAS DAN KELILING BENTUK GEOMETRI")
garis("-")

# --- 1. Persegi (memakai cara impor ke-1) ---
sisi = 10
print(f"\n1. PERSEGI (sisi = {sisi} m)")
print(f"   Luas     : {math_operations.luas_persegi(sisi):.2f} m^2")
print(f"   Keliling : {math_operations.keliling_persegi(sisi):.2f} m")

# --- 2. Persegi Panjang (memakai cara impor ke-1) ---
panjang, lebar = 12, 8
print(f"\n2. PERSEGI PANJANG (panjang = {panjang} m, lebar = {lebar} m)")
print(f"   Luas     : {math_operations.luas_persegi_panjang(panjang, lebar):.2f} m^2")
print(f"   Keliling : {math_operations.keliling_persegi_panjang(panjang, lebar):.2f} m")

# --- 3. Lingkaran (memakai cara impor ke-2) ---
jari_jari = 7
print(f"\n3. LINGKARAN (jari-jari = {jari_jari} m)")
print(f"   Luas     : {luas_lingkaran(jari_jari):.2f} m^2")
print(f"   Keliling : {keliling_lingkaran(jari_jari):.2f} m")

# ============================================================
# B. Konversi Temperatur Suhu (memakai cara impor ke-2)
# ============================================================
print()
garis("-")
print("B. KONVERSI TEMPERATUR SUHU")
garis("-")
print(f"{'Celsius':>10} {'Fahrenheit':>15} {'Kelvin':>12}")
print("-" * 60)

for celsius in [0, 25, 37, 100]:
    fahrenheit = celsius_ke_fahrenheit(celsius)
    kelvin = celsius_ke_kelvin(celsius)
    print(f"{celsius:>8} C {fahrenheit:>12.2f} F {kelvin:>9.2f} K")

# ============================================================
# Footer
# ============================================================
print()
garis()
print("   Semua fungsi modul math_operations berhasil digunakan.")
print("   Fungsi terpakai: 8/8")
garis()