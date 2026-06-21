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
    <div className="min-h-screen bg-slate-50 flex" style={{ minHeight: "100dvh" }}>
      {/* Desktop Sidebar */}
      <AdminSidebar userEmail={userEmail} userRol={userRol} />

      {/* Mobile Sidebar Drawer */}
      <AdminSidebarMobile
        userEmail={userEmail}
        userRol={userRol}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
