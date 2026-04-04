import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PublicNav } from "../_components/PublicNav";
import { PublicFooter } from "../_components/PublicFooter";
import { ScrollToTop } from "../_components/ScrollToTop";

export const metadata: Metadata = {
  title: "Gallery | Expert Media Solutions",
  description:
    "Snapshots from Expert Media Solutions projects, events, and community work across Nsukka, Enugu State, Nigeria.",
};

const heroPattern =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

const IMAGES = [
  { src: "/images/gallery/stc1.JPG", alt: "Gallery image 1" },
  { src: "/images/gallery/stc2.JPG", alt: "Gallery image 2" },
  { src: "/images/gallery/stc3.JPG", alt: "Gallery image 3" },
  { src: "/images/gallery/stc4.JPG", alt: "Gallery image 4" },
  { src: "/images/gallery/stc5.JPG", alt: "Gallery image 5" },
  { src: "/images/gallery/stc6.JPG", alt: "Gallery image 6" },
  { src: "/images/gallery/stc7.JPG", alt: "Gallery image 7" },
  { src: "/images/gallery/stc8.JPG", alt: "Gallery image 8" },
  { src: "/images/gallery/stc9.JPG", alt: "Gallery image 9" },
] as const;

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <PublicNav />

      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-red-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: heroPattern }}
        />
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-red-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24 lg:py-28">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-red-300/95">
            Expert Media Solutions
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Gallery
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            Snapshots from our projects, events, and community work across Nigeria.
          </p>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      </section>

      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold border-l-8 border-red-500 pl-4 sm:text-3xl">Our photos</h2>
          <p className="mt-3 text-sm text-neutral-600 sm:text-base">
            A look behind the scenes — field work, team events, and moments that define our culture.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5">
          {IMAGES.map((img) => (
            <li
              key={img.src}
              className="group overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                />
              </div>
            </li>
          ))}
        </ul>
      </main>

      <section className="border-t border-red-400/30 bg-gradient-to-r from-red-600 to-red-500 px-6 py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">Want to collaborate?</h2>
          <p className="mt-3 text-sm text-white/90 sm:text-base">
            Tell us about your project and we&apos;ll get back to you.
          </p>
          <Link
            href="/contacts"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-red-600 shadow-md transition-transform hover:scale-[1.02] hover:bg-neutral-50"
          >
            Contact us
          </Link>
        </div>
      </section>

      <PublicFooter />

      <ScrollToTop />
    </div>
  );
}
