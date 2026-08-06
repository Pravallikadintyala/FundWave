import { Outlet } from 'react-router-dom';

/**
 * DashboardLayout — wrapper for all authenticated pages.
 *
 * Structure:
 *  ┌─────────────────────────────────────┐
 *  │  Sidebar (fixed left)               │
 *  │  ┌───────────────────────────────┐  │
 *  │  │  TopNavbar                    │  │
 *  │  ├───────────────────────────────┤  │
 *  │  │  <Outlet /> (page content)    │  │
 *  │  └───────────────────────────────┘  │
 *  └─────────────────────────────────────┘
 */
const DashboardLayout = () => (
  <div className="flex h-screen overflow-hidden bg-gray-100">
    {/* Sidebar placeholder */}
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex items-center justify-center">
      <span className="text-sm text-gray-400">Sidebar</span>
    </aside>

    {/* Main area */}
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Top navbar placeholder */}
      <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center px-6">
        <span className="text-sm text-gray-400">TopNavbar</span>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;
