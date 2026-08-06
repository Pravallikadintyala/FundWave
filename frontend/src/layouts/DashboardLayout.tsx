import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import TopNavbar from '@/components/layout/TopNavbar';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className={['dashboard-layout__main', collapsed ? 'dashboard-layout__main--collapsed' : ''].filter(Boolean).join(' ')}>
        <TopNavbar
          onMenuToggle={() => setMobileOpen(v => !v)}
          sidebarCollapsed={collapsed}
        />
        <main className="dashboard-layout__content" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
