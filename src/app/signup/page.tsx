'use client';
import { useState } from 'react';
import { z } from 'zod';
import { login, isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated()) {
    if (typeof window !== 'undefined') router.push('/');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email, password, name });
    if (!parsed.success) {
      setError(parsed.error.errors.map((s) => s.message).join(', '));
      return;
    }

    // For demo reuse login helper to persist 'auth'
    const ok = login(email, password);
    if (ok) {
      // Save profile basic info
      try {
        localStorage.setItem('profile', JSON.stringify({ name, email }));
      } catch (e) {}
      router.push('/');
    } else {
      setError('Signup failed');
    }
  }

  return (
    <div className='max-w-md mx-auto p-6'>
      <h1 className='text-2xl font-semibold mb-4'>Sign up</h1>
      <form onSubmit={onSubmit} className='space-y-3'>
        <div>
          <label className='block text-sm mb-1'>Full name</label>
          <input
            className='w-full p-2 border rounded'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
