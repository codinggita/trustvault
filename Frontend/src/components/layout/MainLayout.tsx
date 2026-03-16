import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-background-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
MainLayout.displayName = 'MainLayout';