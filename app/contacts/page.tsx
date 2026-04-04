import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PublicNav } from "../_components/PublicNav";
import { PublicFooter } from "../_components/PublicFooter";
import { FaPhoneAlt, FaEnvelope, FaFacebook, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import { ScrollToTop } from "../_components/ScrollToTop";

export const metadata: Metadata = {
  title: "Contact Us | Expert Media Solutions",
  description:
    "Reach Expert Media Solutions by phone, email, or social — Nsukka, Enugu State, Nigeria. Let’s plan your next milestone.",
};

const heroPattern =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

const PHONE_DISPLAY = "+234 8034 615 603";
const PHONE_TEL = "+2348034615603";
const EMAIL = "help@expertmediasolution.com";
const ADDRESS_LINE = "1, SCM Close, Onuiyi, Nsukka, Enugu State, Nigeria";
const MAPS_QUERY =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("1 SCM Close, Onuiyi, Nsukka, Enugu State, Nigeria");

type ContactCardProps = {
  href?: string;
  external?: boolean;
  icon: ReactNode;
  iconBg: string;
  title: string;
  children: ReactNode;
};

function ContactCard({ href, external, icon, iconBg, title, children }: ContactCardProps) {
  const inner = (
    <>
      <div className={`mb-4 inline-flex rounded-xl p-3.5 ${iconBg}`}>{icon}</div>
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-neutral-600">{children}</div>
    </>
  );

  const className =
    "group flex h-full flex-col rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-md";

  if (href) {
    return (
      <a
        href={href}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
        <span className="mt-4 text-xs font-medium text-red-600 opacity-0 transition-opacity group-hover:opacity-100">
          Open →
        </span>
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}

export default function ContactsPage() {
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
            Get in touch
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Let&apos;s plan your next milestone
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            Call, write, or visit — we respond to serious enquiries about IT solutions, automation, analytics, and
            digital projects across Nigeria and beyond.
          </p>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      </section>

      <main id="main" className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-semibold border-l-8 border-red-500 pl-4 sm:text-3xl">Contact channels</h2>
          <p className="mt-3 text-sm text-neutral-600 sm:text-base">
            Choose the option that works best for you. We&apos;re here to help scope your needs and next steps.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <ContactCard
            href={`tel:${PHONE_TEL}`}
            icon={<FaPhoneAlt className="h-7 w-7 text-emerald-800" aria-hidden />}
            iconBg="bg-emerald-50"
            title="Call us"
          >
            <p className="font-medium text-neutral-800">{PHONE_DISPLAY}</p>
            <p className="mt-1 text-xs text-neutral-500">Tap to dial on mobile</p>
          </ContactCard>

          <ContactCard
            href={`mailto:${EMAIL}`}
            icon={<FaEnvelope className="h-7 w-7 text-amber-600" aria-hidden />}
            iconBg="bg-amber-50"
            title="Email"
          >
            <p className="break-all font-medium text-neutral-800">{EMAIL}</p>
            <p className="mt-1 text-xs text-neutral-500">We usually reply within one business day</p>
          </ContactCard>

          <ContactCard
            href={MAPS_QUERY}
            external
            icon={<MdLocationCity className="h-7 w-7 text-red-600" aria-hidden />}
            iconBg="bg-red-50"
            title="Office address"
          >
            <p>{ADDRESS_LINE}</p>
            <p className="mt-1 text-xs text-neutral-500">Open in Google Maps</p>
          </ContactCard>

          <ContactCard
            href="https://www.facebook.com/"
            external
            icon={<FaFacebook className="h-7 w-7 text-blue-600" aria-hidden />}
            iconBg="bg-blue-50"
            title="Facebook"
          >
            <p>Expert Media Solutions</p>
            <p className="mt-1 text-xs text-neutral-500">Follow us for updates</p>
          </ContactCard>

          <ContactCard
            href="https://www.linkedin.com/company/"
            external
            icon={<FaLinkedinIn className="h-7 w-7 text-sky-700" aria-hidden />}
            iconBg="bg-sky-50"
            title="LinkedIn"
          >
            <p className="break-all">linkedin.com/company</p>
            <p className="mt-1 text-xs text-neutral-500">Company profile</p>
          </ContactCard>

          <ContactCard
            href="https://www.instagram.com/"
            external
            icon={<FaInstagram className="h-7 w-7 text-rose-700" aria-hidden />}
            iconBg="bg-rose-50"
            title="Instagram"
          >
            <p>{EMAIL}</p>
            <p className="mt-1 text-xs text-neutral-500">Connect on Instagram</p>
          </ContactCard>
        </div>

        <div className="mt-14 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
          <h3 className="text-lg font-semibold text-neutral-900">Prefer the homepage?</h3>
          <p className="mt-2 text-sm text-neutral-600">
            You can still jump to our main site sections for services, gallery, and more.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-neutral-300 bg-neutral-50 px-5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-red-300 hover:bg-red-50"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-neutral-300 bg-neutral-50 px-5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-red-300 hover:bg-red-50"
            >
              Services
            </Link>
            <Link
              href="/team"
              className="rounded-full border border-neutral-300 bg-neutral-50 px-5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-red-300 hover:bg-red-50"
            >
              Team &amp; board
            </Link>
          </div>
        </div>
      </main>

      <section className="border-t border-red-400/30 bg-gradient-to-r from-red-600 to-red-500 px-6 py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">Ready to start?</h2>
          <p className="mt-3 text-sm text-white/90 sm:text-base">
            Send a short note about your goals — we&apos;ll follow up with practical next steps.
          </p>
          <a
            href={`mailto:${EMAIL}?subject=Enquiry%20from%20website`}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-red-600 shadow-md transition-transform hover:scale-[1.02] hover:bg-neutral-50"
          >
            Email us now
          </a>
        </div>
      </section>

      <PublicFooter />

      <ScrollToTop />
    </div>
  );
}
