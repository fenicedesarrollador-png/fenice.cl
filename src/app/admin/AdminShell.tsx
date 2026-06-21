"use client";

import { useState } from "react";
import AdminSidebar, { AdminSidebarMobile } from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

export default function AdminShell({
  children,
  userEmail,
  userRol,
}: {
  children: React.ReactNode;
  userEmail: string;
  userRol: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-scope flex bg-slate-50/80" style={{ minHeight: "100dvh" }}>
      <AdminSidebar userEmail={userEmail} userRol={userRol} />
      <AdminSidebarMobile
        userEmail={userEmail}
        userRol={userRol}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
