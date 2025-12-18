// src/app/admin/layout.tsx
import { ReactNode } from 'react';

export const metadata = {
  title: 'Admin Dashboard',
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  // 🔒 TODO: Add auth redirect if not admin (e.g., use a hook or middleware)
  // if (!isAdmin) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}