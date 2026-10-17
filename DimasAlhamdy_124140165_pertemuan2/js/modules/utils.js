// Arrow Function 1: Mengatur Format Tanggal
export const formatDate = (isoString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(isoString).toLocaleDateString('id-ID', options);
};

// Arrow Function 2: Mengkalkulasi Statistik Tugas
export const calculateStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  return { total, completed, pending };
};

// Arrow Function 3: Generator ID Unik
export const generateUniqueId = () => {
  return 'task-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};