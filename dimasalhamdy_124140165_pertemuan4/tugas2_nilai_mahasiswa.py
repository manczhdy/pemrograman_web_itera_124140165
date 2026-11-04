# List yang berisi minimal 5 dictionary data mahasiswa
mahasiswa = [
    {
        "nama": "Andi",
        "nim": "124140101",
        "nilai_uts": 85,
        "nilai_uas": 90,
        "nilai_tugas": 88
    },
    {
        "nama": "Budi",
        "nim": "124140102",
        "nilai_uts": 70,
        "nilai_uas": 75,
        "nilai_tugas": 80
    },
    {
        "nama": "Citra",
        "nim": "124140103",
        "nilai_uts": 60,
        "nilai_uas": 65,
        "nilai_tugas": 70
    },
    {
        "nama": "Dina",
        "nim": "124140104",
        "nilai_uts": 90,
        "nilai_uas": 95,
        "nilai_tugas": 92
    },
    {
        "nama": "Eko",
        "nim": "124140105",
        "nilai_uts": 40,
        "nilai_uas": 45,
        "nilai_tugas": 50
    }
]

# Menghitung nilai akhir dan menentukan grade
for mhs in mahasiswa:

    nilai_akhir = (
        (30 / 100 * mhs["nilai_uts"]) +
        (40 / 100 * mhs["nilai_uas"]) +
        (30 / 100 * mhs["nilai_tugas"])
    )

    # Menentukan grade
    if nilai_akhir >= 80:
        grade = "A"
    elif nilai_akhir >= 70:
        grade = "B"
    elif nilai_akhir >= 60:
        grade = "C"
    elif nilai_akhir >= 50:
        grade = "D"
    else:
        grade = "E"

    # Menyimpan nilai akhir dan grade ke dictionary
    mhs["nilai_akhir"] = nilai_akhir
    mhs["grade"] = grade


# Menampilkan tabel data mahasiswa
print("=" * 75)
print("                 DAFTAR NILAI MAHASISWA")
print("=" * 75)

print(
    f"{'Nama':<12}"
    f"{'NIM':<15}"
    f"{'UTS':<8}"
    f"{'UAS':<8}"
    f"{'Tugas':<8}"
    f"{'Nilai Akhir':<14}"
    f"{'Grade':<6}"
)

print("-" * 75)

for mhs in mahasiswa:
    print(
        f"{mhs['nama']:<12}"
        f"{mhs['nim']:<15}"
        f"{mhs['nilai_uts']:<8}"
        f"{mhs['nilai_uas']:<8}"
        f"{mhs['nilai_tugas']:<8}"
        f"{mhs['nilai_akhir']:<14.2f}"
        f"{mhs['grade']:<6}"
    )

print("=" * 75)


# Mencari mahasiswa dengan nilai tertinggi dan terendah
nilai_tertinggi = max(mahasiswa, key=lambda x: x["nilai_akhir"])
nilai_terendah = min(mahasiswa, key=lambda x: x["nilai_akhir"])


# Menampilkan hasil nilai tertinggi
print("\nMAHASISWA DENGAN NILAI TERTINGGI")
print("-" * 40)
print(f"Nama        : {nilai_tertinggi['nama']}")
print(f"NIM         : {nilai_tertinggi['nim']}")
print(f"Nilai Akhir : {nilai_tertinggi['nilai_akhir']:.2f}")
print(f"Grade       : {nilai_tertinggi['grade']}")


# Menampilkan hasil nilai terendah
print("\nMAHASISWA DENGAN NILAI TERENDAH")
print("-" * 40)
print(f"Nama        : {nilai_terendah['nama']}")
print(f"NIM         : {nilai_terendah['nim']}")
print(f"Nilai Akhir : {nilai_terendah['nilai_akhir']:.2f}")
print(f"Grade       : {nilai_terendah['grade']}")