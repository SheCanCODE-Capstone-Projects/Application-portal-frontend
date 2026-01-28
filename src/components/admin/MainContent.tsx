// src/components/admin/MainContent.tsx
import { ReactNode } from 'react';

export default function MainContent({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
  );
}