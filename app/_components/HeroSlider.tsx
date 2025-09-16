'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
  images: string[];
  intervalMs?: number;
  children?: React.ReactNode;
};

export function HeroSlider({ images, intervalMs = 5000, children }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images, intervalMs]);

  return (
    <section className="relative overflow-hidden px-6 sm:px-10 py-28 md:py-36 bg-black">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={
            'object-cover pointer-events-none select-none transition-opacity duration-700 ' +
            (i === index ? 'opacity-30' : 'opacity-0')
          }
          aria-hidden
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      <div className="relative max-w-4xl mx-auto text-center">
        {children}
      </div>
    </section>
  );
}




