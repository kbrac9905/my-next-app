export default function Header() {
  return (
    <header className='w-full bg-card p-8 rounded-md shadow-sm'>
      <div className='max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-extrabold'>Welcome to MyStore</h1>
          <p className='text-muted mt-1'>
            Find the best products curated just for you.
          </p>
        </div>
        <div className='flex gap-3'>
          <button className='px-4 py-2 rounded bg-primary text-primary-foreground'>
            Shop Now
          </button>
          <button className='px-4 py-2 rounded border border-border'>
            Learn More
          </button>
        </div>
      </div>
    </header>
  );
}
