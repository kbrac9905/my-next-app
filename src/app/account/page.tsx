'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AccountDashboard() {
  const [profile, setProfile] = useState({ name: '', email: '' });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('profile');
      if (raw) setProfile(JSON.parse(raw));
    } catch (e) {}
  }, []);

  const hello = profile.name
    ? `Hello, ${profile.name}`
    : 'Welcome to your account';

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>{hello}</h1>
          <p className='text-sm text-foreground-muted'>
            Manage your profile, orders and settings.
          </p>
        </div>
        {/* <div className='hidden sm:flex gap-2'>
          <Link
            href='/account/profile'
            className='px-3 py-1 rounded border text-sm'
          >
            Profile
          </Link>
          <Link
            href='/account/my-orders'
            className='px-3 py-1 rounded border text-sm'
          >
            My Orders
          </Link>
        </div> */}
      </div>

      <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6'>
        <div className='col-span-2 space-y-4'>
          <div className='p-4 border rounded'>
            <h2 className='font-semibold'>Quick actions</h2>
            <div className='mt-3 flex flex-wrap gap-3'>
              <Link
                href='/account/profile'
                className='px-4 py-2 rounded border text-sm'
              >
                Edit profile
              </Link>
              <Link
                href='/account/my-orders'
                className='px-4 py-2 rounded border text-sm'
              >
                View orders
              </Link>
              <Link href='/' className='px-4 py-2 rounded border text-sm'>
                Continue shopping
              </Link>
            </div>
          </div>

          <div className='p-4 border rounded'>
            <h2 className='font-semibold'>Account summary</h2>
            <div className='mt-2 text-sm text-muted'>
              Email: {profile.email || '—'}
            </div>
          </div>
        </div>

        {/* <aside className='border rounded p-4'>
          <h3 className='font-semibold mb-2'>Shortcuts</h3>
          <div className='flex flex-col gap-2'>
            <Link href='/account/profile' className='text-sm'>
              Profile
            </Link>
            <Link href='/account/my-orders' className='text-sm'>
              My Orders
            </Link>
          </div>
        </aside> */}
      </div>
    </div>
  );
}
