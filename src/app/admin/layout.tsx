import React from "react";
import RoleGuard from "@/guards/RoleGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return(
    <RoleGuard allowedRoles={['ADMIN']}>
      {children}
    </RoleGuard>
  );
}