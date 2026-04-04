"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  HiArrowRight,
  HiArrowTrendingUp,
  HiBuildingOffice2,
  HiCheckCircle,
  HiClipboardDocumentList,
  HiCube,
  HiPhoto,
  HiServerStack,
  HiTicket,
  HiUsers,
} from "react-icons/hi2";

type MeState = {
  displayName: string;
  isClient: boolean;
};

export default function AdminOverviewPage() {
  const [userCount, setUserCount] = useState<string>("—");
  const [clientCount, setClientCount] = useState<string>("—");
  const [dateLabel, setDateLabel] = useState("");
  const [me, setMe] = useState<MeState | null>(null);

  useEffect(() => {
    setDateLabel(
      new Date().toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  useEffect(() => {
    fetch("/api/me")
      .then(async (r) => {
        if (!r.ok) return;
        const data = (await r.json()) as
          | { kind: "user"; profile: { name?: string; role?: string } }
          | { kind: "client"; profile: { name?: string } };
        if (data.kind === "user") {
          setMe({
            displayName: data.profile.name || "there",
            isClient: false,
          });
        } else if (data.kind === "client") {
          setMe({
            displayName: data.profile.name || "there",
            isClient: true,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/users/count")
      .then(async (r) => {
        if (r.ok) {
          const { total } = await r.json();
          setUserCount(String(total));
        }
      })
      .catch(() => {});
    fetch("/api/clients/count")
      .then(async (r) => {
        if (r.ok) {
          const { total } = await r.json();
          setClientCount(String(total));
        }
      })
      .catch(() => {});
  }, []);

  const quickLinks = useMemo(() => {
    if (me?.isClient) {
      return [
        {
          href: "/admin/tickets",
          label: "Tickets",
          description: "Support and requests",
          icon: HiTicket,
        },
        {
          href: "/admin/analysis",
          label: "Data collection",
          description: "Uploads & questionnaires",
          icon: HiClipboardDocumentList,
        },
        {
          href: "/admin/settings",
          label: "Settings",
          description: "Account preferences",
          icon: HiServerStack,
        },
      ];
    }
    return [
      {
        href: "/admin/users",
        label: "Users",
        description: "Accounts & roles",
        icon: HiUsers,
      },
      {
        href: "/admin/clients",
        label: "Clients",
        description: "Organizations & contacts",
        icon: HiBuildingOffice2,
      },
      {
        href: "/admin/products",
        label: "Products",
        description: "Catalog & pricing",
        icon: HiCube,
      },
      {
        href: "/admin/tickets",
        label: "Tickets",
        description: "Support queue",
        icon: HiTicket,
      },
      {
        href: "/admin/analysis",
        label: "Data collection",
        description: "File uploads",
        icon: HiClipboardDocumentList,
      },
      {
        href: "/admin/hero",
        label: "Hero images",
        description: "Homepage slider",
        icon: HiPhoto,
      },
    ];
  }, [me?.isClient]);

  const greeting = me?.displayName ? `Welcome back, ${me.displayName}` : "Welcome back";

  return (
    <div className="min-h-full bg-gradient-to-b from-neutral-100 via-neutral-100 to-neutral-200/90 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        {/* Welcome */}
        <header className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950 px-6 py-8 text-white shadow-lg sm:px-8 sm:py-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute -right-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-red-500/25 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300/90">Expert Media Solutions</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{greeting}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-300">{dateLabel}</p>
            <p className="mt-4 max-w-2xl text-sm text-neutral-400">
              {me?.isClient
                ? "Your workspace for tickets, uploads, and account settings."
                : "Manage users, clients, products, and site content from one place."}
            </p>
          </div>
        </header>

        {/* KPIs */}
        <section aria-labelledby="kpi-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 id="kpi-heading" className="text-lg font-semibold text-neutral-900 dark:text-white">
                At a glance
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Live counts from your database</p>
            </div>
          </div>
          <div
            className={
              me?.isClient
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            }
          >
            {!me?.isClient ? (
              <>
                <KpiCard label="Users" value={userCount} hint="Team accounts" icon={HiUsers} accent="bg-red-500" />
                <KpiCard
                  label="Clients"
                  value={clientCount}
                  hint="Organizations"
                  icon={HiBuildingOffice2}
                  accent="bg-amber-500"
                />
              </>
            ) : null}
            <KpiCard
              label="Projects"
              value="—"
              hint="Coming soon"
              icon={HiArrowTrendingUp}
              accent="bg-emerald-500"
            />
            <KpiCard label="Open tickets" value="—" hint="View in Tickets" icon={HiTicket} accent="bg-violet-500" />
          </div>
        </section>

        {/* Quick links */}
        <section aria-labelledby="quick-heading">
          <h2 id="quick-heading" className="text-lg font-semibold text-neutral-900 dark:text-white">
            Quick actions
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Jump to common admin tasks</p>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map(({ href, label, description, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex items-start gap-4 rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm transition-all hover:border-red-200 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-red-900/50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1 font-medium text-neutral-900 dark:text-white">
                      {label}
                      <HiArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </span>
                    <span className="mt-0.5 block text-sm text-neutral-500 dark:text-neutral-400">{description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Bottom row */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Recent activity
            </h3>
            <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
              No recent activity to display yet. Key metrics and shortcuts above stay up to date.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              System status
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <StatusRow label="API" ok />
              <StatusRow label="Database" ok />
              <StatusRow label="Background jobs" ok />
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900">
      <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full ${accent} opacity-[0.12]`} />
      <Icon className="relative h-7 w-7 text-red-600 dark:text-red-400" aria-hidden />
      <p className="relative mt-3 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <p className="relative mt-1 text-3xl font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-white">
        {value}
      </p>
      <p className="relative mt-1 text-xs text-neutral-500 dark:text-neutral-500">{hint}</p>
    </div>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-3 py-2.5 dark:bg-neutral-800/80">
      <span className="text-neutral-700 dark:text-neutral-300">{label}</span>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
        {ok ? <HiCheckCircle className="h-4 w-4" aria-hidden /> : null}
        {ok ? "Operational" : "Unknown"}
      </span>
    </li>
  );
}
