"use client"
import Link from 'next/link';
import { useRef, useState } from 'react';

export default function TopNav() {
    const [open, setOpen] = useState(false);
      const menuRef = useRef<HTMLDivElement | null>(null);
  return (
    <header className='w-full h-14 flex items-center justify-between px-4 border-b border-border bg-card'>
      <div className='flex items-center gap-4'>
        <Link href='/dashboard' className='font-semibold text-sm'>
          Dashbord
        </Link>
        <nav className='hidden sm:flex gap-2 text-sm text-muted'>
          <Link
            href='/dashboard/analytics'
            className='px-2 py-1 rounded hover:bg-muted/50'
          >
            Analytics
          </Link>
          <Link
            href='/dashboard/customers'
            className='px-2 py-1 rounded hover:bg-muted/50'
          >
            Customers
          </Link>
        </nav>
      </div>

      <div className='flex items-center gap-3'>
        <button className='text-sm px-3 py-1 rounded bg-muted/10'>New</button>
        {/* <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs'>
          Visite Store
        </div> */}
        {/* profile dropdown */}
        <div className='relative' ref={menuRef}>
          <button
            aria-label='Profile'
            className='ml-2'
            onClick={() => setOpen((v) => !v)}
          >
            <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs'>
              U
            </div>
          </button>

          {open && (
            <div className='absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50'>
              <Link
                href='/'
                className='block px-3 py-2 text-sm hover:bg-muted/10'
              >
                Visite Store
              </Link>
              <Link
                href='/account/my-orders'
                className='block px-3 py-2 text-sm hover:bg-muted/10'
              >
                My Orders
              </Link>
              <Link
                href='/account/profile'
                className='block px-3 py-2 text-sm hover:bg-muted/10'
              >
                Profile
              </Link>
              <button
                className='w-full text-left px-3 py-2 text-sm hover:bg-muted/10 bg-transparent border-0'
                onClick={() => {
                  try {
                    localStorage.removeItem('auth');
                  } catch (e) {}
                  window.location.href = '/login';
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
