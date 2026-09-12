import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { PortalFooter } from '../components/PortalFooter';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <div className="flex-1 flex min-h-0">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="flex-1 flex flex-col">
            <Outlet />
          </main>
        </div>
      </div>
      <PortalFooter portalName="Admin Command Center" />
    </div>
  );
};
