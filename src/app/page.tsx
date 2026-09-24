import Navbar from '@/components/home/Navbar';
import Header from '@/components/home/Header';
import LatestProducts from '@/components/home/LatestProducts';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
    <h1>Deployed success 2 in cloudflare</h1>
      <Navbar />
      <main className='max-w-6xl mx-auto flex-1 p-6'>
        <Header />
        <LatestProducts />
      </main>
      <Footer />
    </div>
  );
}
