'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { listProducts } from '@/lib/products';

function generateOrderNumber() {
  const t = Date.now().toString(36).toUpperCase();
  const rnd = Math.floor(Math.random() * 9000 + 1000).toString();
  return `ORD-${t}-${rnd}`;
}

export default function SuccessPage() {
  const products = listProducts();
  const [orderNum] = useState(() => generateOrderNumber());
  const [date] = useState(() => new Date());
  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    wilaya?: string;
    commune?: string;
    subtotal?: number;
    shipping?: number;
    tax?: number;
    total?: number;
    placedAt?: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('last-order');
      if (raw) {
        const order = JSON.parse(raw);
        setSummary(order);
        setItems(order.items || []);
      } else {
        // fallback to cart if last-order isn't present
        const rawCart = localStorage.getItem('cart');
        const cart = rawCart ? JSON.parse(rawCart) : [];
        const expanded = cart.map((ci: any) => ({
          ...(products.find((p) => p.id === ci.id) as any),
          qty: ci.qty,
        }));
        setItems(expanded);
      }
    } catch (e) {
      setItems([]);
      setSummary(null);
    }

    // clear cart as final step (idempotent)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: [] }));
    }
  }, [products]);

  const subtotal = items.reduce((s, it) => s + (it.price || 0) * it.qty, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-b from-white to-slate-50 py-12'>
      <div className='max-w-3xl w-full bg-white shadow-lg rounded-lg p-6'>
        <div className='flex items-start gap-4'>
          <div className='w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl'>
            🎉
          </div>
          <div className='flex-1'>
            <h1 className='text-2xl font-extrabold'>
              Thank you — order confirmed!
            </h1>
            <p className='text-muted mt-1'>
              We received your order and are preparing it for shipment.
              <div className='mt-3 flex items-center gap-2 text-sm text-muted'>
                <a href='/' className='underline'>
                  Home
                </a>
                <span>/</span>
                <a href='/cart' className='underline'>
                  Cart
                </a>
                <span>/</span>
                <span className='font-medium'>Confirmation</span>
              </div>
            </p>
            <div className='mt-3 flex flex-wrap gap-3 text-sm'>
              <div className='px-3 py-1 bg-muted/10 rounded'>
                Order: <span className='font-medium'>{orderNum}</span>
              </div>
              <div className='px-3 py-1 bg-muted/10 rounded'>
                Date:{' '}
                {summary?.placedAt
                  ? new Date(summary.placedAt).toLocaleString()
                  : date.toLocaleString()}
              </div>
              <div className='px-3 py-1 bg-muted/10 rounded'>
                Items: {items.length}
              </div>
              <div className='px-3 py-1 bg-muted/10 rounded'>
                Total:{' '}
                <span className='font-medium'>
                  ${(summary?.total ?? total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='md:col-span-2 border rounded p-3'>
            <h3 className='font-semibold mb-2'>Order details</h3>
            {items.length === 0 ? (
              <div className='text-sm text-muted'>
                No line items (this can happen with mock orders).
              </div>
            ) : (
              <div className='space-y-3'>
                {items.map((it) => (
                  <div key={it.id} className='flex items-center gap-3'>
                    <div className='w-14 h-12 bg-muted/10 rounded overflow-hidden flex items-center justify-center'>
                      {it.img ? (
                        <Image
                          src={it.img}
                          alt={it.name}
                          width={56}
                          height={44}
                          className='object-contain'
                        />
                      ) : (
                        'Img'
                      )}
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium'>{it.name}</div>
                      <div className='text-sm text-muted'>
                        Qty: {it.qty} • ${it.price}
                      </div>
                    </div>
                    <div className='font-medium'>
                      ${((it.price || 0) * it.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className='border rounded p-3'>
            <h3 className='font-semibold mb-2'>Summary</h3>
            <div className='text-sm space-y-2'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className='flex justify-between font-semibold text-lg'>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className='mt-4 flex gap-2'>
              <Link
                href='/account/my-orders'
                className='px-3 py-2 rounded border border-border text-sm'
              >
                My Orders
              </Link>
              <Link
                href='/'
                className='px-3 py-2 rounded bg-primary text-primary-foreground text-sm'
              >
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>

        <div className='mt-6 text-center text-sm text-muted'>
          If you have any questions, reply to the order confirmation email.
        </div>
      </div>
    </div>
  );
}
