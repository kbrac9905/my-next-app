export default function Footer() {
  return (
    <footer className='w-full border-t border-border bg-card mt-10 p-6'>
      <div className='max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='text-sm'>
          © {new Date().getFullYear()} MyStore. All rights reserved.
        </div>
        <div className='flex gap-4 text-sm text-muted'>
          <a href='#'>Terms</a>
          <a href='#'>Privacy</a>
          <a href='#'>Contact</a>
        </div>
      </div>
    </footer>
  );
}
