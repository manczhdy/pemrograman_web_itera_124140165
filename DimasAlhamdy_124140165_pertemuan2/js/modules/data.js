export class TaskItem {
  constructor({ id = null, title = '', completed = false, createdAt = new Date().toISOString(), deadline = '' }) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.createdAt = createdAt;
    this.deadline = deadline; // Properti baru untuk batas waktu
  }
}

export const fetchInitialTasks = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    if (!response.ok) throw new Error('Gagal mengambil data dari API');

    const data = await response.json();
    
    return data.map(item => new TaskItem({
      id: `api-${item.id}`,
      title: item.title,
      completed: item.completed,
      deadline: '' // API sampel tidak memiliki deadline
    }));
  } catch (error) {
    console.error('Error fetching API:', error);
    return [];
  }
};