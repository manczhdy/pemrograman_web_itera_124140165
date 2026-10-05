// Memuat data dari localStorage saat pertama kali halaman dimuat
let keranjang = JSON.parse(localStorage.getItem("keranjang_kampus")) || [];

// Element Form & Error
const formBarang = document.getElementById("form-barang");
const inputNama = document.getElementById("nama-barang");
const inputHarga = document.getElementById("harga-barang");
const inputQty = document.getElementById("qty-barang");

const errNama = document.getElementById("err-nama");
const errHarga = document.getElementById("err-harga");
const errQty = document.getElementById("err-qty");

// Element Tabel & Ringkasan
const bodyKeranjang = document.getElementById("body-keranjang");
const txtTotal = document.getElementById("txt-total");
const txtDiskon = document.getElementById("txt-diskon");
const txtTotalAkhir = document.getElementById("txt-total-akhir");

// Element Pembayaran
const inputUangBayar = document.getElementById("uang-bayar");
const txtKembalian = document.getElementById("txt-kembalian");
const statusBayar = document.getElementById("status-bayar");
const btnReset = document.getElementById("btn-reset");

// Variable Global Nilai Total Akhir
let totalAkhirGlobal = 0;

// Format Angka ke Rupiah
function formatRupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

// 1. Simpan Data ke LocalStorage
function simpanLocalStorage() {
  localStorage.setItem("keranjang_kampus", JSON.stringify(keranjang));
}

// 2. Render Tabel & Hitung Total Belanja, Diskon
function renderKeranjang() {
  bodyKeranjang.innerHTML = "";

  if (keranjang.length === 0) {
    bodyKeranjang.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888;">Keranjang belanja kosong</td></tr>`;
  }

  let totalBelanja = 0;

  keranjang.forEach((item, index) => {
    let subtotal = item.harga * item.qty;
    totalBelanja += subtotal;

    let row = `
      <tr>
        <td>${index + 1}</td>
        <td>${item.nama}</td>
        <td>${formatRupiah(item.harga)}</td>
        <td>${item.qty}</td>
        <td>${formatRupiah(subtotal)}</td>
        <td>
          <button class="btn btn-hapus" onclick="hapusItem(${index})">Hapus</button>
        </td>
      </tr>`;
    bodyKeranjang.innerHTML += row;
  });

  // Hitung Diskon (10% jika Total Belanja >= Rp 50.000)
  let diskon = 0;
  if (totalBelanja >= 50000) {
    diskon = totalBelanja * 0.10;
  }

  totalAkhirGlobal = totalBelanja - diskon;

  // Tampilkan Nilai Ringkasan
  txtTotal.innerText = formatRupiah(totalBelanja);
  txtDiskon.innerText = formatRupiah(diskon);
  txtTotalAkhir.innerText = formatRupiah(totalAkhirGlobal);

  // Re-kalkulasi kembalian jika uang bayar sudah terisi
  hitungKembalian();
}

// 3. Validasi Form & Tambah Barang
formBarang.addEventListener("submit", function (e) {
  e.preventDefault();

  // Reset pesan error
  errNama.innerText = "";
  errHarga.innerText = "";
  errQty.innerText = "";

  const nama = inputNama.value.trim();
  const harga = parseFloat(inputHarga.value);
  const qty = parseInt(inputQty.value);

  let isValid = true;

  // Validasi Nama Barang (Minimal 3 karakter)
  if (!nama || nama.length < 3) {
    errNama.innerText = "Nama barang wajib diisi minimal 3 karakter!";
    isValid = false;
  }

  // Validasi Harga Satuan (Minimal Rp 500)
  if (isNaN(harga) || harga < 500) {
    errHarga.innerText = "Harga satuan wajib berupa angka positif minimal Rp 500!";
    isValid = false;
  }

  // Validasi Jumlah / Qty (Minimal 1)
  if (isNaN(qty) || qty < 1) {
    errQty.innerText = "Jumlah / Qty minimal 1!";
    isValid = false;
  }

  // Jika Valid, Tambah ke Keranjang
  if (isValid) {
    keranjang.push({ nama, harga, qty });
    simpanLocalStorage();
    renderKeranjang();

    // Reset Form Input
    formBarang.reset();
    inputQty.value = 1;
  }
});

// 4. Hapus Item dari Keranjang
function hapusItem(index) {
  keranjang.splice(index, 1);
  simpanLocalStorage();
  renderKeranjang();
}

// 5. Kalkulator Pembayaran & Kembalian
function hitungKembalian() {
  const uangBayar = parseFloat(inputUangBayar.value);

  if (isNaN(uangBayar) || uangBayar <= 0) {
    txtKembalian.innerText = formatRupiah(0);
    statusBayar.innerText = "";
    statusBayar.className = "info-text";
    return;
  }

  const kembalian = uangBayar - totalAkhirGlobal;

  if (kembalian < 0) {
    txtKembalian.innerText = formatRupiah(0);
    statusBayar.innerText = "Uang belum mencukupi!";
    statusBayar.className = "info-text text-error";
  } else {
    txtKembalian.innerText = formatRupiah(kembalian);
    statusBayar.innerText = "Pembayaran Berhasil / Lunas";
    statusBayar.className = "info-text text-success";
  }
}

// Event listener saat input uang bayar berubah
inputUangBayar.addEventListener("input", hitungKembalian);

// 6. Tombol Transaksi Baru / Reset
btnReset.addEventListener("click", function () {
  if (confirm("Apakah Anda yakin ingin mengosongkan keranjang dan memulai transaksi baru?")) {
    keranjang = [];
    localStorage.removeItem("keranjang_kampus");
    inputUangBayar.value = "";
    statusBayar.innerText = "";
    renderKeranjang();
  }
});

// Jalankan render awal saat pertama dimuat
renderKeranjang();