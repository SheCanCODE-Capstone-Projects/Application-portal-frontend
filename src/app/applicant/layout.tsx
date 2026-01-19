import RoleGuard from "@/guards/RoleGuard";

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['APPLICANT']}>
      {children}
    </RoleGuard>
  );
}