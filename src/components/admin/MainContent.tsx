export default function MainContent({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {children}
        </main>
    );
}