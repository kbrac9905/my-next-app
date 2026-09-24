'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { listProducts } from '@/lib/products';

type CartItem = { id: string; qty: number };

export default function CartPage() {
  const products = listProducts();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw =
        typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    function onUpdate(e: any) {
      const detail = e?.detail;
      if (detail) setCart(detail);
      else {
        const raw = localStorage.getItem('cart');
        setCart(raw ? JSON.parse(raw) : []);
      }
    }
    window.addEventListener('cart-updated', onUpdate);
    return () => window.removeEventListener('cart-updated', onUpdate);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function remove(id: string) {
    setCart((c) => c.filter((i) => i.id !== id));
  }

  const items = cart.map((ci) => ({
    ...products.find((p) => p.id === ci.id)!,
    qty: ci.qty,
  }));

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-semibold mb-4'>Cart</h1>
      <div className='mb-4 p-3 border rounded bg-muted/5'>
        <div className='text-sm font-semibold mb-2'>Debug</div>
        <div className='text-xs'>localStorage(cart):</div>
        <pre className='text-xs bg-white p-2 rounded max-h-28 overflow-auto'>
          {typeof window !== 'undefined' ? localStorage.getItem('cart') : 'n/a'}
        </pre>
        <div className='mt-2'>
          <button
            onClick={() => {
              const raw = localStorage.getItem('cart');
              setCart(raw ? JSON.parse(raw) : []);
            }}
            className='text-xs px-2 py-1 rounded border'
          >
            Refresh from storage
          </button>
        </div>
      </div>
      {items.length === 0 ? (
        <div>
          Your cart is empty. <Link href='/products'>Browse products</Link>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {items.map((it) => (
            <div
              key={it.id}
              className='flex items-center gap-4 border border-border p-3 rounded'
            >
              <Image
                src={it.img}
                alt={it.name}
                width={80}
                height={60}
                className='object-contain'
              />
              <div className='flex-1'>
                <div className='font-medium'>{it.name}</div>
                <div className='text-muted'>
                  ${it.price} × {it.qty}
                </div>
              </div>
              <button
                onClick={() => remove(it.id)}
                className='px-3 py-1 rounded border'
              >
                Remove
              </button>
            </div>
          ))}

          <div className='flex justify-end gap-2'>
            <Link
              href='/checkout'
              className='px-4 py-2 rounded bg-primary text-primary-foreground'
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
