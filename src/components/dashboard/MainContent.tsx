interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      {children}
    </main>
  );
}