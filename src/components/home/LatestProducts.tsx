import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { listProducts } from '@/lib/products';

export default function LatestProducts() {
  const products = listProducts();

  return (
    <section className='mt-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-xl font-semibold'>Latest Products</h3>
        <a href='#' className='text-sm text-muted'>
          View all
        </a>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        {products.map((p) => (
          <article
            key={p.id}
            className='bg-card border border-border rounded p-4'
          >
            <div className='h-40 bg-muted/10 rounded mb-3 flex items-center justify-center overflow-hidden'>
              {p.img ? (
                <Image
                  src={p.img}
                  alt={p.name}
                  width={240}
                  height={160}
                  loading='eager'
                  className='object-contain'
                />
              ) : (
                'Image'
              )}
            </div>
            <div className='flex flex-col gap-1'>
              <div className='font-medium'>{p.name}</div>
              <div className='text-muted text-sm'>${p.price}</div>
              <div className='flex gap-2'>
                <Link
                  href={`/products/${p.id}`}
                  className='text-sm px-3 py-1 rounded border border-border'
                >
                  View
                </Link>
                <AddToCartButton id={p.id} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
