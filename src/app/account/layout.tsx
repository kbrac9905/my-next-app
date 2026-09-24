import Navbar from '@/components/home/Navbar';
import Link from 'next/link';
import AccountGuard from '@/components/account/AccountGuard';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='max-w-6xl mx-auto p-6 w-full'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <aside className='md:col-span-1 border rounded p-4'>
            <h2 className='font-semibold mb-3'>Account</h2>
            <nav className='flex flex-col gap-2'>
              <Link href='/account' className='text-sm'>
                Dashboard
              </Link>
              <Link href='/account/profile' className='text-sm'>
                Profile
              </Link>
              <Link href='/account/my-orders' className='text-sm'>
                My Orders
              </Link>
            </nav>
          </aside>

          <section className='md:col-span-3'>
            <AccountGuard>{children}</AccountGuard>
          </section>
        </div>
      </main>
    </div>
  );
}
