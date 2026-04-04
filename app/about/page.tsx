import Link from "next/link";
import type { Metadata } from "next";
import { PublicNav } from "../_components/PublicNav";
import { PublicFooter } from "../_components/PublicFooter";
import { ScrollToTop } from "../_components/ScrollToTop";
import { GrStatusGood } from "react-icons/gr";
import { BsLightbulb, BsPeople, BsShieldCheck } from "react-icons/bs";
import { MdOutlineHub, MdOutlineTrendingUp } from "react-icons/md";

export const metadata: Metadata = {
  title: "About Us | Expert Media Solutions",
  description:
    "Expert Media Solutions (EMS) delivers tailored IT, automation, analytics, and education solutions — learn who we are, what we stand for, and how we work with clients.",
};

const heroPattern =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

const pillars = [
  {
    title: "Automation that fits",
    body: "We design robotic and process automation around your real workflows — not generic demos — so teams gain throughput without losing control.",
    icon: <MdOutlineHub className="h-7 w-7 text-red-600" aria-hidden />,
    iconBg: "bg-red-50",
  },
  {
    title: "Data you can act on",
    body: "From collection to reporting, we help you structure analytics so leaders see trends early and operations can respond with confidence.",
    icon: <MdOutlineTrendingUp className="h-7 w-7 text-amber-600" aria-hidden />,
    iconBg: "bg-amber-50",
  },
  {
    title: "Enablement & education",
    body: "Scholarships, learning resources, and talent programs are part of how we invest in people — inside EMS and in the communities we serve.",
    icon: <BsLightbulb className="h-7 w-7 text-emerald-700" aria-hidden />,
    iconBg: "bg-emerald-50",
  },
];

const values = [
  {
    title: "Clarity first",
    body: "We explain options in plain language, set realistic scope, and align technology choices with your business outcomes.",
    icon: <BsShieldCheck className="h-6 w-6 text-neutral-800" aria-hidden />,
  },
  {
    title: "Partnership",
    body: "Delivery is collaborative: your domain knowledge plus our engineering and implementation experience.",
    icon: <BsPeople className="h-6 w-6 text-neutral-800" aria-hidden />,
  },
  {
    title: "Long-term thinking",
    body: "We favour maintainable solutions, documentation, and handover so your stack stays useful as you grow.",
    icon: <GrStatusGood className="h-6 w-6 text-neutral-800" aria-hidden />,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <PublicNav />

      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-red-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: heroPattern }}
        />
        <div className="absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-red-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24 lg:py-28">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-red-300/95">
            Expert Media Solutions
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Built for organisations that want technology to work in the real world
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            EMS combines automation, data, hardware, and learning programs so you can modernise operations without losing
            the human context that makes your business unique.
          </p>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      </section>

      <main id="main" className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-semibold border-l-8 border-red-500 pl-4 sm:text-3xl">Our story</h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              In a fast-moving digital landscape, the right stack is not the flashiest — it is the one your team can run,
              measure, and improve. Expert Media Solutions started from that idea: practical IT that connects strategy to
              delivery.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              Today we support clients with robotic automation, sales and operations enablement, analytics, educational
              resources, and curated hardware — always scoped to what you need next, not everything at once.
            </p>
            <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Mission</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                To deliver innovative, tailored IT solutions that improve efficiency, productivity, and growth — with
                transparency and respect for the people behind the systems.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl">Where we focus</h3>
            <p className="mt-2 text-sm text-neutral-600 sm:text-base">
              Three pillars shape most of our project work and product lines.
            </p>
            <ul className="mt-8 grid gap-5 sm:grid-cols-1">
              {pillars.map((p) => (
                <li
                  key={p.title}
                  className="flex gap-4 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                >
                  <div className={`shrink-0 self-start rounded-xl p-3 ${p.iconBg}`}>{p.icon}</div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">{p.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t border-neutral-200 pt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold border-l-8 border-red-500 pl-4 text-left sm:text-3xl">
              How we work with you
            </h2>
            <p className="mt-3 text-left text-sm text-neutral-600 sm:text-base">
              Principles you can expect on every engagement — from discovery to rollout and support.
            </p>
          </div>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
            {values.map((v, i) => (
              <li
                key={v.title}
                className="rounded-2xl border border-neutral-200 bg-white px-5 py-6 text-center shadow-sm sm:px-6"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                  {v.icon}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-red-600">0{i + 1}</p>
                <h3 className="mt-2 text-base font-semibold text-neutral-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
          <h3 className="text-lg font-semibold text-neutral-900">Explore EMS</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Services, team, gallery, and contact — all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
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
            <Link
              href="/gallery"
              className="rounded-full border border-neutral-300 bg-neutral-50 px-5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-red-300 hover:bg-red-50"
            >
              Gallery
            </Link>
            <Link
              href="/contacts"
              className="rounded-full border border-neutral-300 bg-neutral-50 px-5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-red-300 hover:bg-red-50"
            >
              Contact us
            </Link>
          </div>
        </div>
      </main>

      <section className="border-t border-red-400/30 bg-gradient-to-r from-red-600 to-red-500 px-6 py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">Have a project in mind?</h2>
          <p className="mt-3 text-sm text-white/90 sm:text-base">
            Tell us about your goals — we will help you map a practical path from today&apos;s systems to tomorrow&apos;s
            capabilities.
          </p>
          <Link
            href="/contacts"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-red-600 shadow-md transition-transform hover:scale-[1.02] hover:bg-neutral-50"
          >
            Get in touch
          </Link>
        </div>
      </section>

      <PublicFooter />

      <ScrollToTop />
    </div>
  );
}
