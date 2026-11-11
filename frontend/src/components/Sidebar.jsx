import {
  CheckCircleIcon,
  CheckSquareIcon,
  ClockIcon,
  ListTodoIcon,
  PlusIcon,
  XIcon,
} from './Icons';

export default function Sidebar({
  activeFilter,
  onFilterChange,
  counts,
  userName,
  userEmail,
  isOpen,
  onClose,
  onNewTask,
}) {
  const navItems = [
    { id: 'all', label: 'All Tasks', count: counts.total, Icon: ListTodoIcon },
    { id: 'pending', label: 'Pending', count: counts.pending, Icon: ClockIcon },
    { id: 'completed', label: 'Completed', count: counts.completed, Icon: CheckCircleIcon },
  ];

  const initials = (userName || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const handleSelect = (filterId) => {
    onFilterChange(filterId);
    onClose();
  };

  const handleNewTaskClick = () => {
    onNewTask();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
        aria-label="Sidebar navigation"
      >
        <div className="sidebar-top">
          <div className="sidebar-brand-row">
            <div className="sidebar-brand">
              <span className="brand-badge">
                <CheckSquareIcon size={18} />
              </span>
              <div>
                <span className="brand-name">TaskFlow</span>
                <span className="brand-tag">Workspace</span>
              </div>
            </div>

            <button
              type="button"
              className="icon-btn sidebar-close"
              onClick={onClose}
              aria-label="Close navigation menu"
            >
              <XIcon size={18} />
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block sidebar-new-btn"
            onClick={handleNewTaskClick}
          >
            <PlusIcon size={17} />
            <span>New Task</span>
          </button>

          <nav className="sidebar-nav" aria-label="Task views">
            <p className="sidebar-section-label">Tasks</p>
            {navItems.map(({ id, label, count, Icon }) => (
              <button
                key={id}
                type="button"
                className={`sidebar-link ${activeFilter === id ? 'sidebar-link--active' : ''}`}
                onClick={() => handleSelect(id)}
              >
                <span className="sidebar-link-main">
                  <Icon size={17} />
                  <span>{label}</span>
                </span>
                <span className="sidebar-count">{count}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="user-avatar" aria-hidden="true">
              {initials}
            </span>
            <div className="user-meta">
              <span className="user-name">{userName}</span>
              {userEmail && <span className="user-email">{userEmail}</span>}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

