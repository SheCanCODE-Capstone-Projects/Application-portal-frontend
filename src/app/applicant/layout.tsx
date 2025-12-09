export default function ApplicantLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <>

            <main className="min-h-screen">
                {children}
            </main>

        </>
    );
}