PI = 3.14159

#persegi
def luas_persegi(sisi):
    """Menghitung luas persegi dari panjang sisi."""
    return sisi * sisi


def keliling_persegi(sisi):
    """Menghitung keliling persegi dari panjang sisi."""
    return 4 * sisi

#persegi panjang
def luas_persegi_panjang(panjang, lebar):
    """Menghitung luas persegi panjang."""
    return panjang * lebar


def keliling_persegi_panjang(panjang, lebar):
    """Menghitung keliling persegi panjang."""
    return 2 * (panjang + lebar)


#Lingkaran
def luas_lingkaran(jari_jari):
    """Menghitung luas lingkaran dari panjang jari-jari."""
    return PI * jari_jari * jari_jari


def keliling_lingkaran(jari_jari):
    """Menghitung keliling (lingkaran) dari panjang jari-jari."""
    return 2 * PI * jari_jari


#konversi suhu
def celsius_ke_fahrenheit(celsius):
    """Mengkonversi suhu Celsius ke Fahrenheit."""
    return (celsius * 9 / 5) + 32


def celsius_ke_kelvin(celsius):
    """Mengkonversi suhu Celsius ke Kelvin."""
    return celsius + 273.15
