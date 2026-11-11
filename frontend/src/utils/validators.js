const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister({ name, email, password, confirmPassword }) {
  const errors = {};

  if (!name.trim()) errors.name = 'Name is required';
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';

  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email';

  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'At least 6 characters';

  if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';

  return errors;
}

export function validateLogin({ email, password }) {
  const errors = {};

  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email';

  if (!password) errors.password = 'Password is required';

  return errors;
}

export function validateTask({ title, due_date }) {
  const errors = {};

  if (!title.trim()) errors.title = 'Title is required';
  else if (title.trim().length > 100) errors.title = 'Max 100 characters';

  if (!due_date) errors.due_date = 'Due date is required';

  return errors;
}
