'use client';
import { useState } from 'react';

type Props = { id: string };

export default function AddToCartButton({ id }: Props) {
  const [adding, setAdding] = useState(false);

  function add() {
    setAdding(true);
    const raw = localStorage.getItem('cart');
    const cart = raw ? (JSON.parse(raw) as { id: string; qty: number }[]) : [];
    const found = cart.find((c) => c.id === id);
    if (found) found.qty += 1;
    else cart.push({ id, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    // debug: log cart contents so it's easy to inspect in browser console
    try {
      console.debug('[AddToCart] wrote cart ->', cart);
    } catch (e) {
      // ignore in non-browser environments
    }
    // simple visual feedback
    setTimeout(() => setAdding(false), 400);
    // dispatch event so Cart page can listen
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
  }

  return (
    <button
      onClick={add}
      disabled={adding}
      className='px-4 py-2 rounded bg-primary text-primary-foreground'
    >
      {adding ? 'Adding...' : 'Add to cart'}
    </button>
  );
}
