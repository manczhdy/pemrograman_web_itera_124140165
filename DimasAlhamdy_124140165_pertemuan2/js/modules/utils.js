export const formatDate = (isoString) => {
  if (!isoString) return '-';
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(isoString).toLocaleDateString('id-ID', options);
};

// Arrow Function Helper: Format tanggal deadline
export const formatDeadline = (deadlineString) => {
  if (!deadlineString) return 'Tanpa Batas Waktu';
  return formatDate(deadlineString);
};

// Arrow Function Helper: Mengecek apakah tugas lewat batas waktu
export const isOverdue = (deadlineString, completed) => {
  if (!deadlineString || completed) return false;
  return new Date(deadlineString) < new Date();
};

export const calculateStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  return { total, completed, pending };
};

export const generateUniqueId = () => {
  return 'task-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};