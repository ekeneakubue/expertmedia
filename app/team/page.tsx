import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ScrollToTop } from "../_components/ScrollToTop";
import { PublicNav } from "../_components/PublicNav";
import { PublicFooter } from "../_components/PublicFooter";
import { getBoardMembersForHome, getTeamMembersForHome } from "@/lib/team-members";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Team & Board | Expert Media Solutions",
  description:
    "Meet the board and team behind Expert Media Solutions — strategy, delivery, and the people who power our IT solutions.",
};

const heroPattern =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

export default async function TeamPage() {
  const currentYear = new Date().getFullYear();
  const boardMembers = await getBoardMembersForHome();
  const teamMembers = await getTeamMembersForHome();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <PublicNav />

      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-red-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: heroPattern }}
        />
        <div className="absolute -right-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-red-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24 lg:py-28">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-red-300/95">
            Expert Media Solutions
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]">
            The people behind the work
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            Our board sets direction and governance; our team delivers the IT, data, and automation solutions our
            clients rely on every day.
          </p>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      </section>

      <section className="border-b border-neutral-200/80 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold border-l-8 border-red-500 pl-4 sm:text-3xl">Board members</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
              Guiding our mission, values, and long-term strategy.
            </p>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {boardMembers.map((m) => (
              <li
                key={`board-${m.name}-${m.imageUrl}`}
                className="group overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-50/40 shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
                  <Image
                    src={m.imageUrl}
                    alt={m.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pt-24 pb-5 px-5">
                    <p className="text-lg font-semibold text-white">{m.name}</p>
                    {m.memberRole ? (
                      <p className="mt-1 text-sm leading-snug text-white/90">{m.memberRole}</p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold border-l-8 border-red-500 pl-4 sm:text-3xl">Our team</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
              Meet the professionals who design, build, and support your solutions.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {teamMembers.map((m) => (
              <li
                key={`team-${m.name}-${m.imageUrl}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <Image
                    src={m.imageUrl}
                    alt={m.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 border-t border-neutral-100 px-3 py-3.5 sm:px-4">
                  <p className="text-sm font-semibold text-neutral-900 sm:text-base">{m.name}</p>
                  {m.memberRole ? (
                    <p className="text-xs leading-snug text-red-700/90 sm:text-sm">{m.memberRole}</p>
                  ) : (
                    <p className="text-xs text-neutral-500">Team member</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-red-400/30 bg-gradient-to-r from-red-600 to-red-500 px-6 py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">Want to collaborate?</h2>
          <p className="mt-3 text-sm text-white/90 sm:text-base">
            Tell us about your project — we&apos;ll connect you with the right people.
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
