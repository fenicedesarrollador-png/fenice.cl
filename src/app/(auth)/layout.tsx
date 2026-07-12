export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f5f9]">
      {children}
    </div>
  );
}
