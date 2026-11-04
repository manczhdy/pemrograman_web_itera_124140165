berat = float(input("Masukkan berat badan anda (kg): "))
tinggi = float(input("\nMasukkan tinggi badan (M): "))

bmi = berat / (tinggi * tinggi)

if bmi < 18.5:
    kategori = "Berat badan kurang"
elif 18.5 <= bmi < 25:
    kategori = "Berat badan normal"
elif 25 <= bmi < 30:
    kategori = "Berat badan berlebih"
else:
    kategori = "Obesitas"

print(f"bmi: {bmi:.2f} kategori: {kategori}")