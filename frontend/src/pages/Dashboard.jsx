import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  createTask,
  createTasks,
  deleteTask,
  getTasks,
  setCompleted,
  updateTask,
} from '../services/taskService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Spinner from '../components/Spinner';
import StatCard from '../components/StatCard';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import {
  CheckCircleIcon,
  ClockIcon,
  ListTodoIcon,
  SearchIcon,
  XIcon,
} from '../components/Icons';
import { getSampleTasks } from '../utils/sampleTasks';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null); // null = add mode
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const titleInputRef = useRef(null);

  // Fetch tasks once when the authenticated user is available.
  // Sample tasks are opt-in only (button) so production accounts stay empty until the user adds data.
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = (await getTasks()) ?? [];
        if (active) setTasks(data);
      } catch (error) {
        if (import.meta.env.DEV) console.error('Load tasks failed:', error);
        if (active) toast.error(error?.message || 'Could not load tasks');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [user?.id]);

  // Lock background scroll and listen for Escape when the mobile drawer is open
  useEffect(() => {
    if (!sidebarOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarOpen]);

  // Why derive counts instead of storing them in separate state?
  // Computing from the tasks array gives a single source of truth that never goes out of sync.
  const total = tasks.length;
  const completed = tasks.filter((t) => t.is_completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const name = user?.user_metadata?.name || 'there';
  const email = user?.email || '';

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const query = search.trim().toLowerCase();

  // Filter in the UI, then sort: pending first, nearest due dates next, newest created last.
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'pending' && task.is_completed) return false;
      if (filter === 'completed' && !task.is_completed) return false;
      if (query) {
        const inTitle = task.title?.toLowerCase().includes(query);
        const inDesc = task.description?.toLowerCase().includes(query);
        if (!inTitle && !inDesc) return false;
      }
      return true;
    })
    .slice()
    .sort((a, b) => {
      if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
      const aDue = a.due_date || '9999-12-31';
      const bDue = b.due_date || '9999-12-31';
      if (aDue !== bDue) return aDue.localeCompare(bDue);
      return (b.created_at || '').localeCompare(a.created_at || '');
    });

  const focusTaskForm = () => {
    // Brief delay prevents mobile drawer close animation from interfering with focus on iOS/Android
    window.setTimeout(() => {
      titleInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      titleInputRef.current?.focus();
    }, 80);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    focusTaskForm();
  };

  const handleLoadSampleTasks = async () => {
    try {
      const created = await createTasks(getSampleTasks());
      setTasks((prev) => [...created, ...prev]);
      toast.success('Added 10 sample tasks');
    } catch (error) {
      toast.error(error?.message || 'Could not add sample tasks');
    }
  };

  const handleEditStart = (task) => {
    setEditingTask(task);
    focusTaskForm();
  };

  const handleSave = async (values) => {
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, values);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        toast.success('Task updated');
      } else {
        const created = await createTask(values);
        setTasks((prev) => [created, ...prev]);
        toast.success('Task added');
      }
      setEditingTask(null);
      return true;
    } catch {
      toast.error('Could not save task');
      return false;
    }
  };

  const handleToggle = async (task) => {
    try {
      const updated = await setCompleted(task.id, !task.is_completed);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      toast.success(updated.is_completed ? 'Marked as completed' : 'Task reopened');
    } catch {
      toast.error('Could not update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (editingTask?.id === id) setEditingTask(null);
      toast.success('Task deleted');
    } catch {
      toast.error('Could not delete task');
    }
  };

  const filterTabs = [
    { id: 'all', label: 'All', count: total },
    { id: 'pending', label: 'Pending', count: pending },
    { id: 'completed', label: 'Completed', count: completed },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar
        activeFilter={filter}
        onFilterChange={setFilter}
        counts={{ total, pending, completed }}
        userName={name}
        userEmail={email}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewTask={handleNewTask}
      />

      <div className="dashboard-shell">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="dashboard-main">
          <section className="card welcome-banner" aria-label="Dashboard header">
            <div className="welcome-copy">
              <span className="welcome-eyebrow">Your workspace</span>
              <h1 className="welcome-title">Welcome, {name}</h1>
              <p className="welcome-date">{todayLabel}</p>
            </div>
            <div className="progress-summary">
              <span className="progress-label">Completion Rate</span>
              <strong className="progress-value">{completionRate}%</strong>
              <span className="progress-subtext">
                {completed} of {total} completed
              </span>
            </div>
          </section>

          <section className="stats" aria-label="Task summary">
            <StatCard
              label="Total Tasks"
              value={total}
              variant="total"
              icon={ListTodoIcon}
            />
            <StatCard
              label="Pending Tasks"
              value={pending}
              variant="pending"
              icon={ClockIcon}
            />
            <StatCard
              label="Completed Tasks"
              value={completed}
              variant="completed"
              icon={CheckCircleIcon}
            />
          </section>

          <div className="workspace-grid">
            <div className="workspace-form-col">
              <TaskForm
                editingTask={editingTask}
                onSave={handleSave}
                onCancelEdit={() => setEditingTask(null)}
                titleInputRef={titleInputRef}
              />
            </div>

            <section className="task-list-section" aria-labelledby="task-list-heading">
              <div className="card toolbar-card">
                <div className="toolbar-top">
                  <div>
                    <h2 id="task-list-heading" className="section-title">
                      Your Tasks
                    </h2>
                    {tasks.length < 10 && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: 8 }}
                        onClick={handleLoadSampleTasks}
                      >
                        Load 10 Sample Tasks
                      </button>
                    )}
                  </div>
                  <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
                    {filterTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={filter === tab.id}
                        className={`filter-tab ${filter === tab.id ? 'filter-tab--active' : ''}`}
                        onClick={() => setFilter(tab.id)}
                      >
                        <span>{tab.label}</span>
                        <span className="filter-tab-count">{tab.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="search-box">
                  <label htmlFor="task-search" className="sr-only">
                    Search tasks
                  </label>
                  <span className="search-icon" aria-hidden="true">
                    <SearchIcon size={16} />
                  </span>
                  <input
                    id="task-search"
                    type="search"
                    className="search-input"
                    placeholder="Search tasks by title or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      type="button"
                      className="search-clear"
                      onClick={() => setSearch('')}
                      aria-label="Clear search"
                    >
                      <XIcon size={15} />
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="card">
                  <Spinner label="Loading tasks..." />
                </div>
              ) : tasks.length === 0 ? (
                <div className="card empty-state">
                  <p className="empty-state-text">No tasks yet — add your first one!</p>
                  <div className="form-actions" style={{ justifyContent: 'center' }}>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleNewTask}>
                      New Task
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleLoadSampleTasks}
                    >
                      Load 10 Sample Tasks
                    </button>
                  </div>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="card empty-state">
                  <p className="empty-state-text">
                    No tasks match your current search or filter.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setFilter('all');
                      setSearch('');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="task-list">
                  {filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggle}
                      onEdit={handleEditStart}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
