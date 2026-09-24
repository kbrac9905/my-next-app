import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import BackButton from '@/components/BackButton';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { getProduct, listProducts } from '@/lib/products';

type Props = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProduct(id);
  const related = listProducts()
    .filter((p) => p.id !== id)
    .slice(0, 4);

  if (!product) {
    return (
      <div className='min-h-screen'>
        <Navbar />
        <div className='max-w-4xl mx-auto p-6'>
          <BackButton />
          <h1 className='text-xl font-semibold mt-4'>Product not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='max-w-6xl mx-auto p-6'>
        <BackButton />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-4'>
          <div className='md:col-span-2'>
            <div className='h-96 bg-muted/10 rounded overflow-hidden flex items-center justify-center'>
              <Image
                src={product.img}
                alt={product.name}
                width={800}
                height={600}
                className='object-contain'
              />
            </div>
            <h1 className='text-2xl font-semibold mt-4'>{product.name}</h1>
            <p className='text-muted mt-2'>{product.description}</p>
          </div>

          <aside className='border rounded p-4'>
            <div className='text-xl font-bold mb-2'>${product.price}</div>
            <div className='mb-4'>Stock: {product.stock}</div>
            <AddToCartButton id={product.id} />
          </aside>
        </div>

        <section className='mt-8'>
          <h2 className='text-xl font-semibold mb-4'>Related products</h2>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {related.map((p) => (
              <div
                key={p.id}
                className='bg-card border border-border rounded p-3'
              >
                <div className='h-32 bg-muted/10 rounded mb-2 flex items-center justify-center overflow-hidden'>
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={240}
                    height={160}
                    className='object-contain'
                  />
                </div>
                <div className='font-medium'>{p.name}</div>
                <div className='text-muted text-sm'>${p.price}</div>
                <div className='mt-2 flex gap-2'>
                  <Link
                    href={`/products/${p.id}`}
                    className='text-sm px-3 py-1 rounded border border-border'
                  >
                    View
                  </Link>
                  <AddToCartButton id={p.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
