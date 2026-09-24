'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import BackButton from '@/components/BackButton';
import { usePathname } from 'next/navigation';
import { listProducts } from '@/lib/products';

export default function Navbar() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function refresh() {
      const raw = localStorage.getItem('cart');
      const cart = raw ? JSON.parse(raw) : [];
      const sum = cart.reduce((s: number, i: any) => s + (i.qty ?? 0), 0);
      setCount(sum);
    }

    refresh();
    window.addEventListener('cart-updated', refresh as any);
    return () => window.removeEventListener('cart-updated', refresh as any);
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!(e.target instanceof Node)) return;
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSearch(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  // debounced search
  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      setLoadingSearch(false);
      return;
    }

    setLoadingSearch(true);
    const q = query.trim().toLowerCase();
    const timer = setTimeout(() => {
      try {
        const all = listProducts();
        const found = all.filter((p) => {
          return (
            p.name.toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q)
          );
        });
        setResults(found.slice(0, 6));
      } catch (e) {
        setResults([]);
      } finally {
        setLoadingSearch(false);
        setShowSearch(true);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <nav className='w-full flex items-center justify-between py-4 px-6 border-b border-border bg-card'>
      <div className='flex items-center gap-4'>
        <Link href='/' className='font-bold text-lg'>
          MyStore
        </Link>
        {/* show a small back button on mobile when not on root */}
        {pathname && pathname !== '/' && (
          <div className='sm:hidden'>
            <BackButton />
          </div>
        )}
      </div>
      <div className='hidden sm:flex gap-4'>
        <Link href='/' className='text-sm'>
          Home
        </Link>
        <Link href='/products' className='text-sm'>
          Products
        </Link>
        <Link href='/dashboard' className='text-sm'>
          Dashboard
        </Link>
      </div>
      <div className='flex items-center gap-3'>
        <div className='relative' ref={searchRef}>
          <input
            className='hidden sm:block bg-input px-3 py-1 rounded text-sm w-64'
            placeholder='Search products'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length) setShowSearch(true);
            }}
          />

          {showSearch && (results.length > 0 || loadingSearch) && (
            <div className='absolute left-0 mt-1 w-64 bg-white border rounded shadow-md z-50'>
              {loadingSearch ? (
                <div className='p-2 text-sm text-muted'>Loading...</div>
              ) : (
                <div className='p-1'>
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      className='flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/10'
                    >
                      <div className='w-10 h-8 bg-muted/10 rounded overflow-hidden flex items-center justify-center'>
                        {p.img ? (
                          <Image
                            src={p.img}
                            alt={p.name}
                            width={80}
                            height={60}
                            className='object-contain'
                          />
                        ) : (
                          <div className='text-xs'>Img</div>
                        )}
                      </div>
                      <div className='text-sm'>{p.name}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <Link href='/cart' className='relative'>
          <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs'>
            🛒
          </div>
          {count > 0 && (
            <span className='absolute -top-1 -right-2 bg-destructive text-white text-xs rounded-full px-1'>
              {count}
            </span>
          )}
        </Link>
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
    </nav>
  );
}
