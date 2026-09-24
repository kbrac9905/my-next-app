import Link from 'next/link';

const items = [
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/customers', label: 'Customers' },
  { href: '/dashboard/discount', label: 'Discount' },
  { href: '/dashboard/orders', label: 'Orders' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className='w-64 border-r border-border bg-sidebar p-4'>
      <div className='mb-6 font-semibold'>Menu</div>
      <nav className='flex flex-col gap-1'>
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className='px-3 py-2 rounded hover:bg-sidebar-accent/10'
          >
            {i.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
