import TopNav from '@/components/admin/TopNav';
import Sidebar from '@/components/admin/Sidebar';
import DashboardGuard from '@/components/admin/DashboardGuard';

export const metadata = {
  title: 'Dashboard',
};

export default function DashbordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col'>
      <TopNav />
      <div className='flex flex-1'>
        <Sidebar />
        <main className='flex-1 p-6'>
          <DashboardGuard>{children}</DashboardGuard>
        </main>
      </div>
    </div>
  );
}
