'use client';
import { useRouter } from 'next/navigation';

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={`px-3 py-1 rounded border border-border text-sm ${className ?? ''}`}
    >
      ← Back
    </button>
  );
}
