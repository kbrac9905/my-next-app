'use client';
import { useState } from 'react';
import { z } from 'zod';
import { login, isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated()) {
    // If already logged in, redirect to home
    if (typeof window !== 'undefined') router.push('/');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.errors.map((s) => s.message).join(', '));
      return;
    }

    const ok = login(email, password);
    if (ok) {
      router.push('/');
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <div className='max-w-md mx-auto p-6'>
      <h1 className='text-2xl font-semibold mb-4'>Login</h1>
      <form onSubmit={onSubmit} className='space-y-3'>
        <div>
          <label className='block text-sm mb-1'>Email</label>
          <input
            className='w-full p-2 border rounded'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className='block text-sm mb-1'>Password</label>
          <input
            type='password'
            className='w-full p-2 border rounded'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className='text-red-600'>{error}</div>}
        <div className='flex gap-2'>
          <button
            className='px-4 py-2 rounded bg-primary text-primary-foreground'
            type='submit'
          >
            Sign in
          </button>
          <button
            type='button'
            className='px-4 py-2 rounded border'
            onClick={() => {
              setEmail('admin@example.com');
              setPassword('123456');
            }}
          >
            Autofill admin
          </button>
        </div>
      </form>
    </div>
  );
}
