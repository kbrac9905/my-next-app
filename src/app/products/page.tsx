import Link from 'next/link';
import Image from 'next/image';
import { listProducts } from '@/lib/products';
import Navbar from '@/components/home/Navbar';
import AddToCartButton from '@/components/ui/AddToCartButton';

export default function ProductsPage() {
  const products = listProducts();

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='max-w-6xl mx-auto p-6'>
        <h1 className='text-2xl font-semibold mb-4'>Products</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
          {products.map((p) => (
            <article
              key={p.id}
              className='bg-card border border-border rounded p-4'
            >
              <div className='h-40 bg-muted/10 rounded mb-3 flex items-center justify-center overflow-hidden'>
                <Image
                  src={p.img}
                  alt={p.name}
                  width={240}
                  height={160}
                  loading='eager'
                  className='object-contain'
                />
              </div>
              <div className='font-medium'>{p.name}</div>
              <div className='text-muted text-sm mb-2'>${p.price}</div>
              <div className='flex gap-2 mt-2'>
                <Link
                  href={`/products/${p.id}`}
                  className='inline-block px-3 py-1 rounded border border-border'
                >
                  View
                </Link>
                <AddToCartButton id={p.id} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
