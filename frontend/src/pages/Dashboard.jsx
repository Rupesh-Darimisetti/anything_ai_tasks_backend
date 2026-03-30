import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createTask, deleteTask, fetchTasks, updateTask } from '../services/api';

const formatDateInput = (value) => {
  if (!value) return '';
  const d = new Date(value);
  // Keep only YYYY-MM-DD for <input type="date" />
  return d.toISOString().slice(0, 10);
};

export const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const currentMode = useMemo(() => (editingId ? 'edit' : 'create'), [editingId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Session expired, please login again');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setStatus('pending');
    setPriority('medium');
    setDueDate('');
  };

  const buildPayload = () => {
    const payload = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? dueDate : undefined,
    };

    // Remove undefined so API won't get explicit `undefined`.
    return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildPayload();
      if (editingId) {
        await updateTask(editingId, payload);
      } else {
        await createTask(payload);
      }
      resetForm();
      await loadTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title || '');
    setDescription(task.description || '');
    setStatus(task.status || 'pending');
    setPriority(task.priority || 'medium');
    setDueDate(formatDateInput(task.dueDate));
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this task?');
    if (!ok) return;
    try {
      await deleteTask(id);
      if (editingId === id) resetForm();
      await loadTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0 }}>Task Dashboard</h1>
          <div style={{ opacity: 0.8, fontSize: 14 }}>
            Signed in as <b>{user?.name}</b> ({user?.role})
          </div>
        </div>
        <button onClick={() => { logout(); window.location.href = '/'; }} style={{ padding: '8px 12px' }}>
          Logout
        </button>
      </header>

      <section style={{ marginTop: 24, maxWidth: 520 }}>
        <h2>{currentMode === 'edit' ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">pending</option>
              <option value="in-progress">in-progress</option>
              <option value="completed">completed</option>
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>

          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={{ flex: 1, padding: 10 }}>
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} style={{ padding: 10 }}>
              Cancel
            </button>
          </div>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Your tasks</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'crimson' }}>{error}</div>
        ) : (
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {tasks.map((t) => (
              <div key={t._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 700 }}>{t.title}</div>
                <div style={{ opacity: 0.85, marginTop: 4 }}>
                  {t.status} | priority: {t.priority}
                  {t.dueDate ? ` | due: ${formatDateInput(t.dueDate)}` : ''}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button onClick={() => handleEdit(t)} style={{ padding: '6px 10px' }}>Edit</button>
                  <button onClick={() => handleDelete(t._id)} style={{ padding: '6px 10px', color: 'crimson' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && <div>No tasks yet.</div>}
          </div>
        )}
      </section>
    </div>
  );
};