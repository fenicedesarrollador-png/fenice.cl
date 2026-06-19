export default function LoginLayout({ children }: { children: React.ReactNode }) {
  // Login page has its own standalone layout — no sidebar, no admin shell
  return <>{children}</>;
}
