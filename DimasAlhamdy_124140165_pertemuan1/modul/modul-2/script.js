// =========================================================
// 1. Loop Tabel Perkalian (1 sampai 10)
// =========================================================
let angkaPilihan = 7;

console.log("--- Tabel Perkalian " + angkaPilihan + " ---");
document.getElementById("result").innerHTML += `<h3>1. Tabel Perkalian ${angkaPilihan}</h3>`;

for (let i = 1; i <= 10; i++) {
    let hasil = angkaPilihan * i;
    console.log(angkaPilihan + " x " + i + " = " + hasil);
    
    document.getElementById("result").innerHTML += `
        <p>${angkaPilihan} x ${i} = <strong>${hasil}</strong></p>
    `;
}

'========================================================';

// =========================================================
// 2. Fungsi Menghitung Faktorial
// =========================================================
function hitungFaktorial(n) {
    if (n < 0) return "Angka harus non-negatif";
    let hasil = 1;
    for (let i = 1; i <= n; i++) {
        hasil *= i;
    }
    return hasil;
}

let angkaFaktorial = 5;
let hasilFaktorial = hitungFaktorial(angkaFaktorial);

console.log("Faktorial dari " + angkaFaktorial + ": " + hasilFaktorial);

document.getElementById("result").innerHTML += `
    <h3>2. Faktorial</h3>
    <p>Faktorial dari ${angkaFaktorial} (!${angkaFaktorial}): <strong>${hasilFaktorial}</strong></p>
`;

'========================================================';

// =========================================================
// 3. Fungsi Memeriksa Bilangan Prima
// =========================================================
function isPrima(n) {
    if (n <= 1) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}

let angkaCek = 17;
let statusPrima = isPrima(angkaCek) ? "adalah Bilangan Prima" : "Bukan Bilangan Prima";

console.log("Angka " + angkaCek + " " + statusPrima);

document.getElementById("result").innerHTML += `
    <h3>3. Cek Bilangan Prima</h3>
    <p>Angka ${angkaCek}: <strong>${statusPrima}</strong></p>
`;

'========================================================';

// =========================================================
// 4. Kalkulator BMI (Fungsi & Event Handler)
// =========================================================
function hitungBMI(beratKg, tinggiCm) {
    let tinggiM = tinggiCm / 100;
    let bmi = beratKg / (tinggiM * tinggiM);
    let kategori = "";

    if (bmi < 18.5) {
        kategori = "Kekurangan berat badan";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        kategori = "Normal (ideal)";
    } else if (bmi >= 25 && bmi <= 29.9) {
        kategori = "Kelebihan berat badan";
    } else {
        kategori = "Kegemukan (Obesitas)";
    }

    return {
        score: bmi.toFixed(2),
        kategori: kategori
    };
}

// Event Handler saat form submit
document.getElementById("bmiForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let berat = parseFloat(document.getElementById("berat").value);
    let tinggi = parseFloat(document.getElementById("tinggi").value);

    if (berat > 0 && tinggi > 0) {
        let hasil = hitungBMI(berat, tinggi);
        let teksHasil = `BMI: ${hasil.score} (${hasil.kategori})`;

        console.log(teksHasil);
        document.getElementById("bmiResult").innerHTML = `<strong>${teksHasil}</strong>`;
    }
});

'========================================================';

// =========================================================
// 5. Program FizzBuzz (1-100)
// =========================================================
console.log("--- Program FizzBuzz ---");

let deretFizzBuzz = "";

for (let i = 1; i <= 100; i++) {
    let output = "";
    
    if (i % 3 === 0 && i % 5 === 0) {
        output = "FizzBuzz";
    } else if (i % 3 === 0) {
        output = "Fizz";
    } else if (i % 5 === 0) {
        output = "Buzz";
    } else {
        output = i;
    }

    console.log(output);
    deretFizzBuzz += output + (i < 100 ? ", " : "");
}

document.getElementById("result").innerHTML += `
    <h3>5. Program FizzBuzz (1-100)</h3>
    <p>${deretFizzBuzz}</p>
`;