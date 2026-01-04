export default function NowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-auto h-screen">
      {children}
    </div>
  );
}
