// Implementation Class TaskItem (Memodelkan Struktur Data Setiap Item)
export class TaskItem {
  constructor({ id = null, title = '', completed = false, createdAt = new Date().toISOString() }) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.createdAt = createdAt;
  }
}

// Implementasi Fungsi Asinkron (Async/Await) Fetching API Publik
export const fetchInitialTasks = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    if (!response.ok) throw new Error('Gagal mengambil data dari API');

    const data = await response.json();
    
    // Pemetaan data API menjadi Instance Class TaskItem
    return data.map(item => new TaskItem({
      id: `api-${item.id}`,
      title: item.title,
      completed: item.completed
    }));
  } catch (error) {
    console.error('Error fetching API:', error);
    return [];
  }
};