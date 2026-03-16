import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';
import { Outlet } from 'react-router-dom';
import { useUiStore } from '../../store/useUiStore';
import { Spinner } from '../../components/Spinner';

export const MainLayout = () => {
  const { isLoading } = useUiStore();

  return (
    <div className="flex min-h-screen bg-background-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto relative">
          <Outlet />
          {isLoading && (
            <div className="fixed inset-0 bg-background-900/50 backdrop-blur flex items-center justify-center z-50">
              <Spinner size="lg" className="h-12 w-12" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
MainLayout.displayName = 'MainLayout';