import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function AppLayout(): JSX.Element {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
