import { useEffect, useState } from 'react';
import { validateTask } from '../utils/validators';
import { CheckIcon, PencilIcon, PlusIcon, XIcon } from './Icons';

const EMPTY_FORM = { title: '', description: '', due_date: '' };

export default function TaskForm({ editingTask, onSave, onCancelEdit, titleInputRef }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Sync form inputs whenever the user switches between Add mode and Edit mode
  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        due_date: editingTask.due_date || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the inline error for this field as soon as the user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateTask(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      const ok = await onSave({
        title: form.title.trim(),
        description: form.description.trim() || null,
        due_date: form.due_date,
      });

      if (ok && !editingTask) {
        setForm(EMPTY_FORM);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className={`card task-form-card ${editingTask ? 'task-form-card--editing' : ''}`}
      aria-labelledby="task-form-heading"
    >
      <div className="form-card-header">
        <span className="form-card-icon" aria-hidden="true">
          {editingTask ? <PencilIcon size={17} /> : <PlusIcon size={17} />}
        </span>
        <div>
          <h2 id="task-form-heading" className="section-title">
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </h2>
          <p className="section-subtitle">
            {editingTask
              ? 'Update details below and save your changes.'
              : 'Create a task with a title and due date.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-stack" noValidate>
        <div className="form-group">
          <label htmlFor="task-title">Title</label>
          <input
            ref={titleInputRef}
            id="task-title"
            name="title"
            type="text"
            placeholder="e.g. Review RLS policies"
            value={form.title}
            onChange={handleChange}
            maxLength={100}
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            name="description"
            rows={3}
            placeholder="Optional notes or details"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-due-date">Due Date</label>
          <input
            id="task-due-date"
            name="due_date"
            type="date"
            value={form.due_date}
            onChange={handleChange}
          />
          {errors.due_date && <p className="error">{errors.due_date}</p>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {editingTask ? <CheckIcon size={16} /> : <PlusIcon size={16} />}
            <span>{submitting ? 'Saving…' : editingTask ? 'Update Task' : 'Add Task'}</span>
          </button>
          {editingTask && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              disabled={submitting}
            >
              <XIcon size={16} />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
