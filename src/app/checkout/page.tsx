'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { listProducts } from '@/lib/products';
import CITIES from '@/data/algeria_cities.sample.json';

type CartItem = { id: string; qty: number };

export default function CheckoutPage() {
  const router = useRouter();
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
    window.addEventListener('cart-updated', onUpdate as any);
    return () => window.removeEventListener('cart-updated', onUpdate as any);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const items = useMemo(
    () =>
      cart
        .map((ci) => ({
          ...(products.find((p) => p.id === ci.id) as any),
          qty: ci.qty,
        }))
        .filter(Boolean),
    [cart, products],
  );

  const subtotal = items.reduce((s, it) => s + (it.price || 0) * it.qty, 0);
  const shipping = subtotal > 100 ? 0 : 9.99; // simple rule
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  // address form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');

  const communes = useMemo(() => {
    const w = (CITIES as any[]).find((c) => c.wilaya_name === wilaya);
    return w ? w.communes : [];
  }, [wilaya]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Please enter your full name';
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/))
      e.email = 'Enter a valid email';
    if (!phone.trim()) e.phone = 'Enter your phone number';
    if (!wilaya) e.wilaya = 'Select a wilaya';
    if (!commune) e.commune = 'Select a commune';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function finalizeOrder() {
    if (!validate()) return;
    // create a snapshot of the order so success page can show real data
    try {
      const snapshot = {
        name,
        email,
        phone,
        wilaya,
        commune,
        items,
        subtotal,
        shipping,
        tax,
        total,
        placedAt: new Date().toISOString(),
      };
      localStorage.setItem('last-order', JSON.stringify(snapshot));
    } catch (e) {
      // ignore
    }

    // in real app you'd post to server; here we clear cart and navigate to success
    localStorage.removeItem('cart');
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: [] }));
    router.push('/success');
  }

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h1 className='text-2xl font-semibold mb-4'>Checkout</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <section className='md:col-span-2'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium'>Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full mt-1 p-2 border rounded'
                placeholder='Your name'
              />
              {errors.name && (
                <div className='text-red-600 text-sm'>{errors.name}</div>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium'>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full mt-1 p-2 border rounded'
                placeholder='you@example.com'
              />
              {errors.email && (
                <div className='text-red-600 text-sm'>{errors.email}</div>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium'>Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className='w-full mt-1 p-2 border rounded'
                placeholder='+213 5X XXX XXXX'
              />
              {errors.phone && (
                <div className='text-red-600 text-sm'>{errors.phone}</div>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium'>Wilaya</label>
                <select
                  value={wilaya}
                  onChange={(e) => {
                    setWilaya(e.target.value);
                    setCommune('');
                  }}
                  className='w-full mt-1 p-2 border rounded'
                >
                  <option value=''>Select wilaya</option>
                  {(CITIES as any[]).map((w) => (
                    <option key={w.wilaya_name} value={w.wilaya_name}>
                      {w.wilaya_name}
                    </option>
                  ))}
                </select>
                {errors.wilaya && (
                  <div className='text-red-600 text-sm'>{errors.wilaya}</div>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium'>Commune</label>
                <select
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className='w-full mt-1 p-2 border rounded'
                >
                  <option value=''>Select commune</option>
                  {communes.map((c: any) => (
                    <option key={c.commune_name} value={c.commune_name}>
                      {c.commune_name}
                    </option>
                  ))}
                </select>
                {errors.commune && (
                  <div className='text-red-600 text-sm'>{errors.commune}</div>
                )}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium'>
                Address (street, building)
              </label>
              <input
                className='w-full mt-1 p-2 border rounded'
                placeholder='Street address'
              />
            </div>
          </div>

          <div className='mt-6'>
            <button
              onClick={finalizeOrder}
              className='px-4 py-2 rounded bg-primary text-primary-foreground'
            >
              Complete Order
            </button>
          </div>
        </section>

        <aside className='md:col-span-1 border p-4 rounded'>
          <h2 className='font-semibold mb-3'>Order summary</h2>
          <div className='space-y-3'>
            {items.length === 0 ? (
              <div className='text-sm text-muted'>No items in cart</div>
            ) : (
              items.map((it: any) => (
                <div key={it.id} className='flex items-center gap-3'>
                  <div className='w-16 h-12 bg-muted/10 rounded overflow-hidden flex items-center justify-center'>
                    {it.img ? (
                      <Image
                        src={it.img}
                        alt={it.name}
                        width={64}
                        height={48}
                        className='object-contain'
                      />
                    ) : (
                      'Image'
                    )}
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>{it.name}</div>
                    <div className='text-sm text-muted'>
                      ${it.price} × {it.qty}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className='mt-4 border-t pt-3 space-y-2 text-sm'>
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
        </aside>
      </div>
    </div>
  );
}
