// src/app/admin/layout.tsx
import AdminSidebar from '@/components/admin/Sidebar';
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminSidebar/>
  );
}