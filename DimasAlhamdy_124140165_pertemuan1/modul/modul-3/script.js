const wrapperEl = document.getElementById("wrapper-utama");
wrapperEl.innerHTML = `<hr class="my-6 border-slate-300"><h2 class="text-xl font-bold mb-4">Latihan Array & CRUD Data</h2><div id="output-sistem"></div>`;
const areaOutput = document.getElementById("output-sistem");

// Data Awal Mahasiswa (Minimal 5 Objek)
let listMahasiswa = [
  { nama: "Fajar Nugraha", nim: "220101001", prodi: "Sains Data", nilai: 88 },
  { nama: "Gita Gutawa", nim: "220101002", prodi: "Teknik Informatika", nilai: 95 },
  { nama: "Hendra Wijaya", nim: "220101003", prodi: "Sistem Informasi", nilai: 74 },
  { nama: "Indah Permata", nim: "220101004", prodi: "Sains Data", nilai: 82 },
  { nama: "Joko Susilo", nim: "220101005", prodi: "Teknik Elektro", nilai: 68 }
];

// Latihan 1: Tampilkan Tabel Data Mahasiswa
function tampilkanTabel(data) {
  if (data.length === 0) {
    return `<p class="text-slate-500 italic my-2">Belum ada data mahasiswa.</p>`;
  }

  let tabel = `
    <table class="w-full border-collapse border border-slate-300 my-3 text-left">
      <thead>
        <tr class="bg-slate-200">
          <th class="border border-slate-300 p-2">No</th>
          <th class="border border-slate-300 p-2">Nama Lengkap</th>
          <th class="border border-slate-300 p-2">NIM</th>
          <th class="border border-slate-300 p-2">Prodi</th>
          <th class="border border-slate-300 p-2">Nilai</th>
          <th class="border border-slate-300 p-2">Aksi</th>
        </tr>
      </thead>
      <tbody>`;

  data.forEach((mhs, idx) => {
    tabel += `
      <tr class="hover:bg-slate-100">
        <td class="border border-slate-300 p-2">${idx + 1}</td>
        <td class="border border-slate-300 p-2">${mhs.nama}</td>
        <td class="border border-slate-300 p-2">${mhs.nim}</td>
        <td class="border border-slate-300 p-2">${mhs.prodi}</td>
        <td class="border border-slate-300 p-2">${mhs.nilai}</td>
        <td class="border border-slate-300 p-2 space-x-1">
          <button onclick="persiapkanEdit(${idx})" class="bg-amber-500 text-white px-2 py-1 rounded text-xs hover:bg-amber-600">Edit</button>
          <button onclick="hapusMhs(${idx})" class="bg-rose-500 text-white px-2 py-1 rounded text-xs hover:bg-rose-600">Hapus</button>
        </td>
      </tr>`;
  });

  tabel += `</tbody></table>`;
  return tabel;
}

areaOutput.innerHTML += `<h3 class="font-semibold text-lg mt-4">1. Daftar Mahasiswa</h3><div id="tabel-container"></div>`;
document.getElementById("tabel-container").innerHTML = tampilkanTabel(listMahasiswa);

// Latihan 2: Cari Mahasiswa dengan Nilai Tertinggi
function cariMhsTerbaik(data) {
  if (data.length === 0) return null;
  return data.reduce((tertinggi, mhs) => (mhs.nilai > tertinggi.nilai ? mhs : tertinggi), data[0]);
}

const mhsTerbaik = cariMhsTerbaik(listMahasiswa);
areaOutput.innerHTML += `
  <div class="my-3 p-3 bg-cyan-50 border-l-4 border-cyan-500">
    <p><strong>2. Nilai Tertinggi:</strong> ${mhsTerbaik ? `${mhsTerbaik.nama} (${mhsTerbaik.nim}) - Nilai:${mhsTerbaik.nilai}` : 'Data kosong'}</p>
  </div>`;

// Latihan 3: Filter Mahasiswa Di Atas Rata-Rata
function hitungRata2(data) {
  if (data.length === 0) return 0;
  const total = data.reduce((acc, item) => acc + item.nilai, 0);
  return total / data.length;
}

const nilaiRata = hitungRata2(listMahasiswa);
const mhsLulusRata = listMahasiswa.filter(item => item.nilai > nilaiRata);
areaOutput.innerHTML += `
  <div class="my-3 p-3 bg-emerald-50 border-l-4 border-emerald-500">
    <p><strong>3. Rata-Rata Nilai:</strong> <strong>${nilaiRata.toFixed(2)}</strong></p>
    <p>Mahasiswa di atas rata-rata: <strong>${mhsLulusRata.map(m => `${m.nama} (${m.nilai})`).join(", ")}</strong></p>
  </div>`;

// Latihan 4: Pengurutan Nama (Ascending / Descending)
function susunNama(data, urutan = "asc") {
  const salinan = [...data];
  salinan.sort((a, b) => urutan === "asc" ? a.nama.localeCompare(b.nama) : b.nama.localeCompare(a.nama));
  return salinan;
}

areaOutput.innerHTML += `
  <div class="my-3 p-3 bg-indigo-50 border-l-4 border-indigo-500 space-y-1">
    <p><strong>4. Urutan Nama Mahasiswa:</strong></p>
    <p>• Ascending (A-Z): <strong>${susunNama(listMahasiswa, "asc").map(m => m.nama).join(", ")}</strong></p>
    <p>• Descending (Z-A): <strong>${susunNama(listMahasiswa, "desc").map(m => m.nama).join(", ")}</strong></p>
  </div>`;

// Latihan 5: Fitur CRUD Sederhana dengan Event Handler
areaOutput.innerHTML += `
  <h3 class="font-semibold text-lg mt-6 mb-2">5. Form Olah Data (CRUD)</h3>
  <div class="flex flex-wrap gap-2 mb-3">
    <input type="text" id="input-nama" placeholder="Nama Mahasiswa" class="border border-slate-300 p-2 rounded w-44">
    <input type="text" id="input-nim" placeholder="NIM" class="border border-slate-300 p-2 rounded w-36">
    <input type="text" id="input-prodi" placeholder="Prodi" class="border border-slate-300 p-2 rounded w-44" value="Sains Data">
    <input type="number" id="input-nilai" placeholder="Nilai" class="border border-slate-300 p-2 rounded w-24">
    <button id="btn-simpan" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Simpan</button>
    <button id="btn-batal" class="bg-slate-400 text-white px-4 py-2 rounded hover:bg-slate-500 hidden">Batal</button>
  </div>
  <div id="status-info" class="text-sm font-medium"></div>
`;

let targetIndex = -1; // -1 = Tambah Data Baru, >=0 = Edit Data

function bersihkanForm() {
  document.getElementById("input-nama").value = "";
  document.getElementById("input-nim").value = "";
  document.getElementById("input-prodi").value = "Sains Data";
  document.getElementById("input-nilai").value = "";
  document.getElementById("btn-simpan").innerText = "Simpan";
  document.getElementById("btn-batal").classList.add("hidden");
  targetIndex = -1;
}

function refreshTabel() {
  document.getElementById("tabel-container").innerHTML = tampilkanTabel(listMahasiswa);
}

// Event Simpan (Create & Update)
document.getElementById("btn-simpan").addEventListener("click", function() {
  const nama = document.getElementById("input-nama").value.trim();
  const nim = document.getElementById("input-nim").value.trim();
  const prodi = document.getElementById("input-prodi").value.trim() || "Sains Data";
  const nilai = parseFloat(document.getElementById("input-nilai").value);

  if (!nama || !nim || isNaN(nilai)) {
    document.getElementById("status-info").innerHTML = `<p class="text-rose-500">Mohon lengkapi Nama, NIM, dan Nilai!</p>`;
    return;
  }

  if (targetIndex === -1) {
    // Create (Tambah)
    listMahasiswa.push({ nama, nim, prodi, nilai });
    document.getElementById("status-info").innerHTML = `<p class="text-emerald-600">Berhasil menambahkan <strong>${nama}</strong>.</p>`;
  } else {
    // Update (Edit)
    listMahasiswa[targetIndex] = { nama, nim, prodi, nilai };
    document.getElementById("status-info").innerHTML = `<p class="text-emerald-600">Data <strong>${nama}</strong> berhasil diperbarui.</p>`;
  }

  refreshTabel();
  bersihkanForm();
});

// Event Batal Edit
document.getElementById("btn-batal").addEventListener("click", function() {
  bersihkanForm();
  document.getElementById("status-info").innerHTML = `<p class="text-slate-500">Proses edit dibatalkan.</p>`;
});

// Edit Data (Isi ke Form)
function persiapkanEdit(index) {
  const m = listMahasiswa[index];
  document.getElementById("input-nama").value = m.nama;
  document.getElementById("input-nim").value = m.nim;
  document.getElementById("input-prodi").value = m.prodi;
  document.getElementById("input-nilai").value = m.nilai;
  document.getElementById("btn-simpan").innerText = "Update";
  document.getElementById("btn-batal").classList.remove("hidden");
  targetIndex = index;
}

// Hapus Data
function hapusMhs(index) {
  const [terhapus] = listMahasiswa.splice(index, 1);
  refreshTabel();
  document.getElementById("status-info").innerHTML = `<p class="text-rose-500">Data <strong>${terhapus.nama}</strong> telah dihapus.</p>`;
  bersihkanForm();
}