import { useEffect, useRef, useState } from 'react';
import {
  CalendarIcon,
  CheckIcon,
  PencilIcon,
  RotateCcwIcon,
  TrashIcon,
} from './Icons';

function getLocalTodayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [busy, setBusy] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const isOverdue =
    !task.is_completed && Boolean(task.due_date) && task.due_date < getLocalTodayISO();

  const handleToggle = async () => {
    setBusy(true);
    try {
      await onToggle(task);
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await onDelete(task.id);
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  };

  const statusLabel = task.is_completed
    ? 'Completed'
    : isOverdue
      ? 'Overdue'
      : 'Pending';

  const statusClass = task.is_completed
    ? 'badge--completed'
    : isOverdue
      ? 'badge--overdue'
      : 'badge--pending';

  return (
    <article className={`card task-item ${task.is_completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-meta-top">
          <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
          {task.due_date && (
            <span className={`task-due ${isOverdue ? 'due-overdue' : ''}`}>
              <CalendarIcon size={14} />
              <span>
                Due {task.due_date}
                {isOverdue ? ' (Overdue)' : ''}
              </span>
            </span>
          )}
        </div>

        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>

      <div className="task-actions">
        <button
          type="button"
          className={`btn btn-sm ${task.is_completed ? 'btn-secondary' : 'btn-success'}`}
          onClick={handleToggle}
          disabled={busy}
        >
          {task.is_completed ? <RotateCcwIcon size={15} /> : <CheckIcon size={15} />}
          <span>{busy ? 'Saving…' : task.is_completed ? 'Reopen' : 'Complete'}</span>
        </button>
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={() => onEdit(task)}
          disabled={busy}
        >
          <PencilIcon size={15} />
          <span>Edit</span>
        </button>
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={handleDelete}
          disabled={busy}
        >
          <TrashIcon size={15} />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
}
