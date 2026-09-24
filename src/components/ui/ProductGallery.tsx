'use client';
import Image from 'next/image';
import { useState } from 'react';

type Props = { images: string[]; alt: string };

export default function ProductGallery({ images, alt }: Props) {
  const [idx, setIdx] = useState(0);
  return (
    <div>
      <div className='h-80 bg-muted/10 rounded mb-3 flex items-center justify-center overflow-hidden'>
        <Image
          src={images[idx]}
          alt={alt}
          width={480}
          height={320}
          loading='eager'
          className='object-contain'
        />
      </div>
      <div className='flex gap-2'>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className='w-16 h-12 bg-card border border-border rounded overflow-hidden'
          >
            <Image
              src={src}
              alt={`${alt} ${i}`}
              width={64}
              height={48}
              className='object-cover'
            />
          </button>
        ))}
      </div>
    </div>
  );
}
