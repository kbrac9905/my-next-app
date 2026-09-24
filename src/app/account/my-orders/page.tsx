'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MyOrdersPage() {
  const [lastOrder, setLastOrder] = useState<any | null>(null);
  const [status, setStatus] = useState<string>('Pending');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('last-order');
      if (raw) setLastOrder(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    // if the order has a status saved, use it; otherwise keep default
    try {
      const raw = localStorage.getItem('last-order');
      if (raw) {
        const o = JSON.parse(raw);
        if (o.status) setStatus(o.status);
      }
    } catch (e) {}
  }, [lastOrder]);

  if (!lastOrder) {
    return (
      <div>
        <h1 className='text-2xl font-semibold mb-4'>My Orders</h1>
        <div className='text-sm text-muted'>You have no recent orders.</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold mb-4'>My Orders</h1>
      <div className='border rounded p-4 mb-4'>
        <div className='flex justify-between'>
          <div>
            Order placed: {new Date(lastOrder.placedAt).toLocaleString()}
          </div>
          <div className='flex items-center gap-3'>
            <div className='font-semibold'>${lastOrder.total?.toFixed(2)}</div>
            <div
              className='px-2 py-1 rounded-full text-xs text-white'
              style={{
                background:
                  status === 'Delivered'
                    ? 'green'
                    : status === 'Shipped'
                      ? 'blue'
                      : status === 'Processing'
                        ? 'orange'
                        : status === 'Cancelled'
                          ? 'red'
                          : 'gray',
              }}
            >
              {status}
            </div>
          </div>
        </div>

        <div className='mt-3 space-y-2'>
          {lastOrder.items?.map((it: any) => (
            <div key={it.id} className='flex items-center gap-3'>
              <div className='w-12 h-10 bg-muted/10 rounded overflow-hidden flex items-center justify-center'>
                {it.img ? (
                  <img
                    src={it.img}
                    alt={it.name}
                    className='object-contain w-full'
                  />
                ) : (
                  'Img'
                )}
              </div>
              <div className='flex-1'>
                <div className='font-medium'>{it.name}</div>
                <div className='text-sm text-muted'>Qty: {it.qty}</div>
              </div>
              <div>${((it.price || 0) * it.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <Link
        href='/'
        className='px-3 py-2 rounded bg-primary text-primary-foreground'
      >
        Continue shopping
      </Link>
    </div>
  );
}
