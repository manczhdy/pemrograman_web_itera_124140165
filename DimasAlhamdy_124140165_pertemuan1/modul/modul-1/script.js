const nama = "Dimas Alhamdy";
let usia = 20;
const kota_asal = "Bandar Lampung";

console.log("Nama: " + nama);
console.log("Usia: " + usia);
console.log("Kota asal: " + kota_asal);

document.getElementById("result").innerHTML += `
<p> Nama: <strong>${nama}</strong></p>
<p> Usia: <strong>${usia}</strong></p>
<p> Kota Asal: <strong>${kota_asal}</strong></p>
`;

'==================================================';

let nilai = 89;
let status_lulus = "";

if(nilai >= 70){
    status_lulus = "Selamat anda lulus";
}else{
    status_lulus = "Sayang sekali anda tidak lulus";
}

console.log("nilai: " + nilai);
console.log("Status lulus: " + status_lulus);

document.getElementById("result").innerHTML += `
<p> nilai: <strong>${nilai}</strong></p>
<p> Status lulus: <strong>${status_lulus}</strong></p>
`;

'========================================================';

let kategori_usia = "";

if(usia < 12){
    kategori_usia = "anak - anak";
}else if(usia >= 12 && usia <= 17){
    kategori_usia = "remaja";
}else if(usia >= 18 && usia <= 59){
    kategori_usia = "dewasa";
}else{
    kategori_usia = "Lansia";
}

console.log("Usia: " + usia);
console.log("Kategori usia: " + kategori_usia);

document.getElementById("result").innerHTML += `
<p> Usia: <strong>${usia}</strong></p>
<p> Kategori Usia: <strong>${kategori_usia}</strong></p>
`;

'========================================================';

let hari = new Date().getDay();
let namaHari = "";

switch (hari) {
  case 1:
    namaHari = "Sunday";
    break;
  case 2:
    namaHari = "Monday";
    break;
  case 3:
    namaHari = "Tuesday";
    break;
  case 4:
    namaHari = "Wednesday";
    break;
  case 5:
    namaHari = "Thursday";
    break;
  case 6:
    namaHari = "Friday";
    break;
  case 7:
    namaHari = "Saturday";
    break;
  default:
    namaHari = "There isn't any name for that daya apparently";
}

console.log("Hari ini adalah: " + namaHari);

document.getElementById("result").innerHTML += `
  <p>Hari ini adalah: <strong>${namaHari}</strong></p>
`;

'===================================================================';

let grade =
  nilai >= 90 ? "A"
  : nilai >= 80 ? "B"
  : nilai >= 70 ? "C"
  : nilai >= 60 ? "D"
  : "E";

  
console.log("Grade: " + grade);

document.getElementById("result").innerHTML += `
<p> Grade: <strong>${grade}</strong></p>
`;