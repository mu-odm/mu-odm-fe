"use client";

import Image from 'next/image'

import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();

  const goToProductPage = () => {
      router.push('/product_view');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>hello world</div>
      <button onClick={goToProductPage} className="btn">Go to Product Page</button>
      <div>
      </div>
      <div>
        <Image src={''} alt={''} />
      </div>
    </main>
  );
}
