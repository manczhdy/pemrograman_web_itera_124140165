import { TaskItem, fetchInitialTasks } from './modules/data.js';
import { formatDate, calculateStats, generateUniqueId } from './modules/utils.js';

// Implementation Class DashboardApp (Mengelola State, LocalStorage, dan Event)
export class DashboardApp {
  #tasks = [];
  #storageKey = 'personal_dashboard_tasks';

  constructor() {
    this.cacheDomElements();
    this.bindEvents();
    this.init();
  }

  cacheDomElements() {
    this.taskForm = document.getElementById('task-form');
    this.taskIdInput = document.getElementById('task-id');
    this.taskTitleInput = document.getElementById('task-title');
    this.taskListEl = document.getElementById('task-list');
    this.statsContainer = document.getElementById('stats-container');
    this.formTitle = document.getElementById('form-title');
    this.btnSave = document.getElementById('btn-save');
    this.btnCancel = document.getElementById('btn-cancel');
    this.loadingEl = document.getElementById('loading-indicator');
  }

  bindEvents() {
    this.taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    this.btnCancel.addEventListener('click', () => this.resetForm());
  }

  async init() {
    const savedData = localStorage.getItem(this.#storageKey);

    if (savedData) {
      const parsedData = JSON.parse(savedData);
      this.#tasks = parsedData.map(item => new TaskItem(item));
    } else {
      // Mengambil data dari API jika localStorage masih kosong
      this.loadingEl.classList.remove('hidden');
      const apiTasks = await fetchInitialTasks();
      this.#tasks = [...apiTasks]; // Spread Operator untuk inisialisasi state
      this.loadingEl.classList.add('hidden');
      this.saveToLocalStorage();
    }

    this.render();
  }

  saveToLocalStorage() {
    localStorage.setItem(this.#storageKey, JSON.stringify(this.#tasks));
  }

  // Destructuring di parameter fungsi ({ title }) & Spread Operator saat update state
  addTask({ title }) {
    const newTask = new TaskItem({
      id: generateUniqueId(),
      title,
      completed: false
    });

    // Spread Operator menjaga immutability state
    this.#tasks = [newTask, ...this.#tasks];
    this.saveToLocalStorage();
    this.render();
  }

  updateTask(id, { title }) {
    this.#tasks = this.#tasks.map(task => 
      task.id === id ? new TaskItem({ ...task, title }) : task
    );

    this.saveToLocalStorage();
    this.render();
  }

  deleteTask(id) {
    this.#tasks = this.#tasks.filter(task => task.id !== id);
    this.saveToLocalStorage();
    this.render();
  }

  toggleTaskStatus(id) {
    this.#tasks = this.#tasks.map(task => 
      task.id === id ? new TaskItem({ ...task, completed: !task.completed }) : task
    );

    this.saveToLocalStorage();
    this.render();
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const id = this.taskIdInput.value;
    const title = this.taskTitleInput.value.trim();

    if (!title) return;

    if (id) {
      this.updateTask(id, { title });
    } else {
      this.addTask({ title });
    }

    this.resetForm();
  }

  prepareEdit(id) {
    const task = this.#tasks.find(item => item.id === id);
    if (!task) return;

    this.taskIdInput.value = task.id;
    this.taskTitleInput.value = task.title;
    this.formTitle.innerText = 'Edit Tugas';
    this.btnSave.innerText = 'Update Tugas';
    this.btnCancel.classList.remove('hidden');
  }

  resetForm() {
    this.taskForm.reset();
    this.taskIdInput.value = '';
    this.formTitle.innerText = 'Tambah Tugas Baru';
    this.btnSave.innerText = 'Simpan Tugas';
    this.btnCancel.classList.add('hidden');
  }

  renderStats() {
    const { total, completed, pending } = calculateStats(this.#tasks);

    // Template Literals untuk Rendering Statistik
    this.statsContainer.innerHTML = `
      <div class="stat-card">
        <h3>Total Tugas</h3>
        <p>${total}</p>
      </div>
      <div class="stat-card">
        <h3>Selesai</h3>
        <p style="color: var(--success-color);">${completed}</p>
      </div>
      <div class="stat-card">
        <h3>Belum Selesai</h3>
        <p style="color: var(--warning-color);">${pending}</p>
      </div>
    `;
  }

  renderTaskList() {
    if (this.#tasks.length === 0) {
      this.taskListEl.innerHTML = `<p style="text-align:center; color: var(--text-muted); padding: 1rem;">Belum ada tugas.</p>`;
      return;
    }

    // Template Literals & Destructuring pada pencetakan item
    this.taskListEl.innerHTML = this.#tasks.map(({ id, title, completed, createdAt }) => `
      <li class="task-item ${completed ? 'completed' : ''}">
        <div class="task-info">
          <input type="checkbox" ${completed ? 'checked' : ''} data-id="${id}" class="chk-status">
          <div>
            <span class="task-text">${title}</span>
            <span class="task-date">${formatDate(createdAt)}</span>
          </div>
        </div>
        <div class="task-actions">
          <button data-id="${id}" class="btn btn-warning btn-edit">Edit</button>
          <button data-id="${id}" class="btn btn-danger btn-delete">Hapus</button>
        </div>
      </li>
    `).join('');

    this.attachListEvents();
  }

  attachListEvents() {
    // Event Delegation untuk Toggle Status, Edit, dan Delete
    this.taskListEl.querySelectorAll('.chk-status').forEach(chk => {
      chk.addEventListener('change', (e) => this.toggleTaskStatus(e.target.dataset.id));
    });

    this.taskListEl.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => this.prepareEdit(e.target.dataset.id));
    });

    this.taskListEl.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => this.deleteTask(e.target.dataset.id));
    });
  }

  render() {
    this.renderStats();
    this.renderTaskList();
  }
}