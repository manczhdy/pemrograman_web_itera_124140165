import { TaskItem, fetchInitialTasks } from './modules/data.js';
import { formatDate, formatDeadline, isOverdue, calculateStats, generateUniqueId } from './modules/utils.js';

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
    this.taskDeadlineInput = document.getElementById('task-deadline'); // Element baru
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
      this.loadingEl.classList.remove('hidden');
      const apiTasks = await fetchInitialTasks();
      this.#tasks = [...apiTasks];
      this.loadingEl.classList.add('hidden');
      this.saveToLocalStorage();
    }

    this.render();
  }

  saveToLocalStorage() {
    localStorage.setItem(this.#storageKey, JSON.stringify(this.#tasks));
  }

  addTask({ title, deadline }) {
    const newTask = new TaskItem({
      id: generateUniqueId(),
      title,
      completed: false,
      deadline
    });

    this.#tasks = [newTask, ...this.#tasks];
    this.saveToLocalStorage();
    this.render();
  }

  updateTask(id, { title, deadline }) {
    this.#tasks = this.#tasks.map(task => 
      task.id === id ? new TaskItem({ ...task, title, deadline }) : task
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
    const deadline = this.taskDeadlineInput.value;

    if (!title) return;

    if (id) {
      this.updateTask(id, { title, deadline });
    } else {
      this.addTask({ title, deadline });
    }

    this.resetForm();
  }

  prepareEdit(id) {
    const task = this.#tasks.find(item => item.id === id);
    if (!task) return;

    this.taskIdInput.value = task.id;
    this.taskTitleInput.value = task.title;
    this.taskDeadlineInput.value = task.deadline || ''; // Mengisi nilai deadline pada form
    this.formTitle.innerText = 'Edit Tugas';
    this.btnSave.innerText = 'Update Tugas';
    this.btnCancel.classList.remove('hidden');
  }

  resetForm() {
    this.taskForm.reset();
    this.taskIdInput.value = '';
    this.taskDeadlineInput.value = '';
    this.formTitle.innerText = 'Tambah Tugas Baru';
    this.btnSave.innerText = 'Simpan Tugas';
    this.btnCancel.classList.add('hidden');
  }

  renderStats() {
    const { total, completed, pending } = calculateStats(this.#tasks);

    this.statsContainer.innerHTML = `
      <div class="stat-card">
        <h3>Total Tugas</h3>
        <p>${total}</p>
      </div>
      <div class="stat-card">
        <h3>Selesai</h3>
        <p>${completed}</p>
      </div>
      <div class="stat-card">
        <h3>Belum Selesai</h3>
        <p>${pending}</p>
      </div>
    `;
  }

  renderTaskList() {
    if (this.#tasks.length === 0) {
      this.taskListEl.innerHTML = `<p style="text-align:center; color: var(--text-muted); padding: 1rem;">Belum ada tugas.</p>`;
      return;
    }

    this.taskListEl.innerHTML = this.#tasks.map(({ id, title, completed, createdAt, deadline }) => {
      const overdue = isOverdue(deadline, completed);

      return `
        <li class="task-item ${completed ? 'completed' : ''}">
          <div class="task-info">
            <input type="checkbox" ${completed ? 'checked' : ''} data-id="${id}" class="chk-status">
            <div class="task-meta">
              <span class="task-text">${title}</span>
              <span class="task-date">Dibuat: ${formatDate(createdAt)}</span>
              <span class="task-deadline-info">
                 Deadline: <strong>${formatDeadline(deadline)}</strong>
                ${overdue ? `<span class="badge-overdue">Lewat Deadline</span>` : ''}
              </span>
            </div>
          </div>
          <div class="task-actions">
            <button data-id="${id}" class="btn btn-warning btn-edit">Edit</button>
            <button data-id="${id}" class="btn btn-danger btn-delete">Hapus</button>
          </div>
        </li>
      `;
    }).join('');

    this.attachListEvents();
  }

  attachListEvents() {
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