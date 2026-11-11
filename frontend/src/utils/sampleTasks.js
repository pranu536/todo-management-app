function isoOffset(daysFromToday) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** 10 demo tasks kept in the DB after first empty-dashboard seed. */
export function getSampleTasks() {
  return [
    {
      title: 'Plan weekly priorities',
      description: 'List top goals for work and personal focus.',
      due_date: isoOffset(0),
      is_completed: false,
    },
    {
      title: 'Review project README',
      description: 'Confirm setup steps and live demo URL are clear.',
      due_date: isoOffset(1),
      is_completed: false,
    },
    {
      title: 'Prepare interview demo script',
      description: 'Walk through register, login, CRUD, and logout.',
      due_date: isoOffset(2),
      is_completed: false,
    },
    {
      title: 'Check mobile responsiveness',
      description: 'Test dashboard at 360px, tablet, and desktop widths.',
      due_date: isoOffset(3),
      is_completed: false,
    },
    {
      title: 'Polish task form validation',
      description: 'Verify title and due date errors clear while typing.',
      due_date: isoOffset(-1),
      is_completed: false,
    },
    {
      title: 'Confirm Supabase RLS policies',
      description: 'Ensure each user only sees their own tasks.',
      due_date: isoOffset(4),
      is_completed: true,
    },
    {
      title: 'Capture app screenshots',
      description: 'Register, login, dashboard, edit, completed, mobile.',
      due_date: isoOffset(5),
      is_completed: false,
    },
    {
      title: 'Deploy frontend to Render',
      description: 'Set env vars and verify SPA routes after refresh.',
      due_date: isoOffset(6),
      is_completed: false,
    },
    {
      title: 'Write commit messages',
      description: 'Keep Git history clean with feature-focused messages.',
      due_date: isoOffset(-2),
      is_completed: true,
    },
    {
      title: 'Rehearse Q&A answers',
      description: 'Explain AuthContext, ProtectedRoute, and derived stats.',
      due_date: isoOffset(7),
      is_completed: true,
    },
  ];
}
