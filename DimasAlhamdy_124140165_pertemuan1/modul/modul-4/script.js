// =========================================================
// 4. FITUR DARK MODE TOGGLE (Manipulasi Class CSS)
// =========================================================
const btnDarkMode = document.getElementById("btn-dark-mode");
const appBody = document.getElementById("app-body");

btnDarkMode.addEventListener("click", function () {
  // Toggle background dan warna teks body
  appBody.classList.toggle("bg-slate-900");
  appBody.classList.toggle("text-white");
  appBody.classList.toggle("bg-slate-50");
  appBody.classList.toggle("text-slate-800");

  // Toggle warna background untuk kartu-kartu
  const cards = document.querySelectorAll(".card-item");
  cards.forEach(card => {
    card.classList.toggle("bg-slate-800");
    card.classList.toggle("border-slate-700");
    card.classList.toggle("bg-white");
    card.classList.toggle("border-slate-200");
  });
});

// =========================================================
// 1 & 2. FORM MAHASISWA + VALIDASI + LOCALSTORAGE
// =========================================================
const formMhs = document.getElementById("form-mhs");
const mhsError = document.getElementById("mhs-error");
const mhsTabelContainer = document.getElementById("mhs-tabel-container");

// Ambil data dari localStorage atau buat array kosong jika belum ada
let listMhs = JSON.parse(localStorage.getItem("data_mhs")) || [];

function simpanDanRenderMhs() {
  localStorage.setItem("data_mhs", JSON.stringify(listMhs));
  renderTabelMhs();
}

function renderTabelMhs() {
  if (listMhs.length === 0) {
    mhsTabelContainer.innerHTML = `<p class="text-slate-500 italic text-sm">Data mahasiswa masih kosong.</p>`;
    return;
  }

  let html = `
    <table class="w-full border-collapse border border-slate-300 text-left text-sm">
      <thead>
        <tr class="bg-slate-100 dark:text-slate-800">
          <th class="border border-slate-300 p-2">No</th>
          <th class="border border-slate-300 p-2">Nama</th>
          <th class="border border-slate-300 p-2">NIM</th>
          <th class="border border-slate-300 p-2">Prodi</th>
          <th class="border border-slate-300 p-2">Aksi</th>
        </tr>
      </thead>
      <tbody>`;

  listMhs.forEach((mhs, i) => {
    html += `
      <tr>
        <td class="border border-slate-300 p-2">${i + 1}</td>
        <td class="border border-slate-300 p-2">${mhs.nama}</td>
        <td class="border border-slate-300 p-2">${mhs.nim}</td>
        <td class="border border-slate-300 p-2">${mhs.prodi}</td>
        <td class="border border-slate-300 p-2">
          <button onclick="hapusMhs(${i})" class="bg-rose-500 text-white px-2 py-1 rounded text-xs hover:bg-rose-600">Hapus</button>
        </td>
      </tr>`;
  });

  html += `</tbody></table>`;
  mhsTabelContainer.innerHTML = html;
}

// Validasi & Tambah Mahasiswa
formMhs.addEventListener("submit", function (e) {
  e.preventDefault();
  const nama = document.getElementById("mhs-nama").value.trim();
  const nim = document.getElementById("mhs-nim").value.trim();
  const prodi = document.getElementById("mhs-prodi").value.trim();

  // Validasi Form sederhana
  if (!nama || !nim || !prodi) {
    mhsError.innerText = "Semua kolom (Nama, NIM, Prodi) harus diisi!";
    return;
  }

  mhsError.innerText = "";
  listMhs.push({ nama, nim, prodi });
  simpanDanRenderMhs();
  formMhs.reset();
});

function hapusMhs(index) {
  listMhs.splice(index, 1);
  simpanDanRenderMhs();
}

renderTabelMhs();

// =========================================================
// 3 & 5. API POSTS + SEARCH FILTER + PAGINATION
// =========================================================
let dataPosts = [];
let halamanAktif = 1;
const jumlahPerHalaman = 5;

const postList = document.getElementById("post-list");
const postSearch = document.getElementById("post-search");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const pageInfo = document.getElementById("page-info");

// Ambil data dari API
async function ambilPosts() {
  postList.innerHTML = `<p class="text-sm text-slate-500">Memuat data dari API...</p>`;
  try {
    const respon = await fetch("https://jsonplaceholder.typicode.com/posts");
    dataPosts = await respon.json();
    renderPosts();
  } catch (err) {
    postList.innerHTML = `<p class="text-sm text-rose-500">Gagal mengambil data API.</p>`;
  }
}

// Filter berdasarkan judul search
function dapatkanPostsFiltered() {
  const kataKunci = postSearch.value.toLowerCase().trim();
  return dataPosts.filter(post => post.title.toLowerCase().includes(kataKunci));
}

// Render daftar post & pagination
function renderPosts() {
  const filtered = dapatkanPostsFiltered();
  const totalHalaman = Math.ceil(filtered.length / jumlahPerHalaman) || 1;

  if (halamanAktif > totalHalaman) halamanAktif = totalHalaman;

  const awal = (halamanAktif - 1) * jumlahPerHalaman;
  const postsTampil = filtered.slice(awal, awal + jumlahPerHalaman);

  if (postsTampil.length === 0) {
    postList.innerHTML = `<p class="text-sm text-slate-500 italic">Judul post tidak ditemukan.</p>`;
  } else {
    postList.innerHTML = postsTampil.map(post => `
      <div class="border border-slate-200 p-3 rounded text-sm bg-slate-50 dark:bg-slate-700 dark:border-slate-600">
        <h4 class="font-bold capitalize mb-1">${post.id}. ${post.title}</h4>
        <p class="text-xs text-slate-600 dark:text-slate-300">${post.body}</p>
      </div>
    `).join("");
  }

  pageInfo.innerText = `Halaman ${halamanAktif} dari ${totalHalaman}`;
  btnPrev.disabled = halamanAktif === 1;
  btnNext.disabled = halamanAktif >= totalHalaman;
}

// Event Search Input
postSearch.addEventListener("input", function () {
  halamanAktif = 1;
  renderPosts();
});

// Event Tombol Pagination
btnPrev.addEventListener("click", function () {
  if (halamanAktif > 1) {
    halamanAktif--;
    renderPosts();
  }
});

btnNext.addEventListener("click", function () {
  const totalHalaman = Math.ceil(dapatkanPostsFiltered().length / jumlahPerHalaman);
  if (halamanAktif < totalHalaman) {
    halamanAktif++;
    renderPosts();
  }
});

ambilPosts();

// =========================================================
// 6. TODO LIST (DOM Manipulation & LocalStorage)
// =========================================================
const todoInput = document.getElementById("todo-input");
const todoAdd = document.getElementById("todo-add");
const todoList = document.getElementById("todo-list");

let listTodos = JSON.parse(localStorage.getItem("data_todos")) || [];

function simpanDanRenderTodos() {
  localStorage.setItem("data_todos", JSON.stringify(listTodos));
  renderTodos();
}

function renderTodos() {
  if (listTodos.length === 0) {
    todoList.innerHTML = `<p class="text-sm text-slate-500 italic">Belum ada tugas.</p>`;
    return;
  }

  todoList.innerHTML = listTodos.map((todo, idx) => `
    <li class="flex items-center justify-between p-2 border border-slate-200 rounded text-sm bg-slate-50 dark:bg-slate-700 dark:border-slate-600">
      <div class="flex items-center gap-2">
        <input type="checkbox" ${todo.selesai ? "checked" : ""} onchange="toggleStatusTodo(${idx})" class="cursor-pointer">
        <span class="${todo.selesai ? "line-through text-slate-400" : ""}">${todo.teks}</span>
      </div>
      <button onclick="hapusTodo(${idx})" class="bg-rose-500 text-white px-2 py-1 rounded text-xs hover:bg-rose-600">Hapus</button>
    </li>
  `).join("");
}

// Tambah Todo
todoAdd.addEventListener("click", function () {
  const teks = todoInput.value.trim();
  if (!teks) return;

  listTodos.push({ teks, selesai: false });
  todoInput.value = "";
  simpanDanRenderTodos();
});

// Tandai Selesai / Belum
function toggleStatusTodo(index) {
  listTodos[index].selesai = !listTodos[index].selesai;
  simpanDanRenderTodos();
}

// Hapus Todo
function hapusTodo(index) {
  listTodos.splice(index, 1);
  simpanDanRenderTodos();
}

renderTodos();