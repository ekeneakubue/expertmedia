import Link from "next/link";
import Image from "next/image";
import { MobileMenu } from "./_components/MobileMenu";
import { HeroSlider } from "./_components/HeroSlider";

export default async function Home() {
  // Load hero images from admin-managed storage; fall back to defaults
  let heroImages: string[] = [];
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || '';
    const url = base ? `${base}/api/hero` : '/api/hero';
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const items = (await res.json()) as { id: string }[];
      heroImages = items.map((it) => `/api/hero/${it.id}`);
    }
  } catch {}
  if (heroImages.length === 0) {
    heroImages = ["/images/hero-1.jpg", "/images/hero-2.jpg", "/images/hero-3.jpg"];
  }
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="w-full bg-white top-0 z-10">
        <div className="w-full mx-auto flex items-center justify-between md:justify-center px-6 py-3 relative">
          <Link href='/' className="font-semibold text-center"><Image src="/images/logo.png" alt="Expert Media Solutions" width={160} height={48} /></Link>
          <MobileMenu
            links={[
              { href: '#about', label: 'About Us' },
              { href: '#services', label: 'Services' },
              { href: '#team', label: 'Our Team' },
              { href: '#board', label: 'Board Members' },
              { href: '#gallery', label: 'Gallery' },
              { href: '#contact', label: 'Contact Us' },
              { href: '/login', label: 'Login' },
            ]}
          />
        </div>
        <div className="mt-0 hidden sm:flex items-center sm:w-full justify-center  text-xs bg-red-400">
          <nav className="flex items-center">
            <Link href="#about" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-l-2 border-l-amber-50 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">About Us</Link>
            <a href="#services" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Services</a>
            <a href="#team" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Our Team</a>
            <a href="#board" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Board Members</a>
            <a href="#gallery" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Gallery</a>
            <a href="#contact" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Contact Us</a>
            <a href="/login" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Login</a>
          </nav>
        </div>
      </header>

      {/* Hero Slider */}
      <HeroSlider images={heroImages}>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
          Welcome to ExpertMediaSolutions
        </h1>
        <p className="mt-4 text-gray-200 text-base sm:text-lg">
          Your trusted IT solutions partner. We help you transform operations with automation, analytics, enablement, and education tailored to your goals.
        </p>
        <div className="pt-6">
          <Link href="#contact" className="inline-flex items-center justify-center rounded-md bg-red-500 text-white px-6 py-3 text-sm font-medium hover:bg-red-600">
            Find Your Solution
          </Link>
        </div>
      </HeroSlider>

      {/* Why Choose Expert Media */}
      <section id="why" className="px-16sm:px-10 py-16 flex gap-[4rem] px-[10rem] dark:bg-neutral-950">
        <div className="max-w-6xl grid gap-3 text-center sm:text-left">
          <h2 className="text-2xl font-semibold">Why Choose Expert Media?</h2>
          <p className="text-gray-700 dark:text-gray-200 max-w-3xl mx-auto sm:mx-0">
            We deliver tailored IT solutions that help businesses thrive—combining automation, analytics, enablement, and
            education into one cohesive approach.
          </p>
        </div>

        <div className="max-w-6xl grid gap-3">
          <h2 className="text-2xl font-semibold">Who we are?</h2>
          <p className="text-gray-700 dark:text-gray-200 max-w-3xl">
            A team of passionate IT professionals focused on turning technology into business outcomes. Our mission is to
            deliver innovative, pragmatic solutions that scale with you.
          </p>
        </div>
      </section>

      

      {/* Our Expertise */}
      <section id="expertise" className="px-6 sm:px-10 py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Our Expertise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard title="Robotic Automation" description="Automate repetitive tasks, reduce errors, and boost throughput." />
            <FeatureCard title="Sales Enablement" description="Equip teams with the tools and processes to close more deals." />
            <FeatureCard title="Data Analysis" description="Turn data into insight with pipelines, dashboards, and models." />
            <FeatureCard title="Educational Resources" description="Courses, webinars, and guides to upskill your organization." />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-6 sm:px-10 py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Core services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ServiceCard title="Helpdesk" points={["Multi-channel support","SLA-driven","Asset management"]} />
            <ServiceCard title="Cloud & DevOps" points={["AWS/Azure/SaaS","CI/CD","Cost optimization"]} />
            <ServiceCard title="Security" points={["Access & identity","Backups & DR","Compliance"]} />
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section id="approach" className="px-6 sm:px-10 py-16">
        <div className="max-w-6xl mx-auto grid gap-3">
          <h2 className="text-2xl font-semibold">Our Approach</h2>
          <p className="text-gray-700 dark:text-gray-200 max-w-3xl">
            We partner closely with your stakeholders to understand goals and constraints, then design and implement
            pragmatic solutions—followed by hands-on training and support.
          </p>
        </div>
      </section>

      {/* Our Process */}
      <section id="process" className="px-6 sm:px-10 py-16 bg-gradient-to-b from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
        <div className="max-w-6xl mx-auto grid gap-6">
          <h2 className="text-2xl font-semibold">Our Process</h2>
          <ol className="grid grid-cols-1 md:grid-cols-4 gap-4 list-decimal list-inside">
            <li className="border rounded-md p-4 bg-white/80 dark:bg-neutral-900/70">
              <div className="font-medium">Needs Assessment</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Audit current environment and identify opportunities.</div>
            </li>
            <li className="border rounded-md p-4 bg-white/80 dark:bg-neutral-900/70">
              <div className="font-medium">Solution Design</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Blueprint aligned to business goals and constraints.</div>
            </li>
            <li className="border rounded-md p-4 bg-white/80 dark:bg-neutral-900/70">
              <div className="font-medium">Implementation</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Plan, execute, and migrate with minimal disruption.</div>
          </li>
            <li className="border rounded-md p-4 bg-white/80 dark:bg-neutral-900/70">
              <div className="font-medium">Training & Support</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Enable your teams and provide ongoing assistance.</div>
          </li>
        </ol>
        </div>
      </section>

      {/* Our Team */}
      <section id="team" className="px-6 sm:px-10 py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto grid gap-3">
          <h2 className="text-2xl font-semibold">Our Team</h2>
          <p className="text-gray-700 dark:text-gray-200 text-sm">Meet the professionals behind our solutions.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard title="Engineering" description="Cloud, automation, and cybersecurity experts." />
            <FeatureCard title="Delivery" description="Program and project managers ensuring outcomes." />
            <FeatureCard title="Advisory" description="Strategy, governance, and compliance specialists." />
          </div>
        </div>
      </section>

      {/* Board Members */}
      <section id="board" className="px-6 sm:px-10 py-16">
        <div className="max-w-6xl mx-auto grid gap-3">
          <h2 className="text-2xl font-semibold">Board Members</h2>
          <p className="text-gray-700 dark:text-gray-200 text-sm">Guiding our mission and long-term strategy.</p>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="px-6 sm:px-10 py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto grid gap-3">
          <h2 className="text-2xl font-semibold">Gallery</h2>
          <p className="text-gray-700 dark:text-gray-200 text-sm">Snapshots from projects, events, and community work.</p>
        </div>
      </section>

      {/* Core Values */}
      <section id="values" className="px-6 sm:px-10 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Core values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard title="Innovation" description="Exploring new tech to keep you ahead." />
            <FeatureCard title="Excellence" description="High standards in delivery and support." />
            <FeatureCard title="Integrity" description="Honesty and transparency in every engagement." />
            <FeatureCard title="Customer Focus" description="Outcomes that serve your mission." />
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="px-6 sm:px-10 py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            <FeatureCard title="RobEMS" description="Robotic automation suite" />
            <FeatureCard title="SalEMS" description="Sales enablement toolkit" />
            <FeatureCard title="LapEMS" description="Hardware & lifecycle" />
            <FeatureCard title="DatEMS" description="Analytics & insights" />
            <FeatureCard title="EduEMS" description="Learning resources" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="px-6 sm:px-10 py-16 bg-red-50 dark:bg-red-950">
        <div className="max-w-6xl mx-auto grid gap-4 text-center">
          <h3 className="text-xl font-semibold">Let’s plan your next milestone</h3>
          <p className="text-gray-700 dark:text-gray-200 text-sm">
            Share your goals and current setup. We’ll follow up within one business day.
          </p>
          <Link href="mailto:hello@example.com" className="mx-auto inline-flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black px-5 py-2.5 text-sm font-medium hover:opacity-90">
            hello@example.com
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 py-10 border-t text-sm text-gray-600 dark:text-gray-300 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="font-semibold">ExpertMedia IT</div>
            <p className="text-xs">Solve problems, improve efficiency, and transform your organization using innovative tech-powered solutions.</p>
          </div>
          <div>
            <div className="font-medium mb-2">Company</div>
            <ul className="space-y-1">
              <li><a className="hover:underline" href="#">Home</a></li>
              <li><a className="hover:underline" href="#about">Company History</a></li>
              <li><a className="hover:underline" href="#values">Our Vision</a></li>
              <li><a className="hover:underline" href="#values">Our Mission</a></li>
            </ul>
          </div>
          <div>
            <div className="font-medium mb-2">Products</div>
            <ul className="space-y-1">
              <li><a className="hover:underline" href="#products">RobEMS</a></li>
              <li><a className="hover:underline" href="#products">SalEMS</a></li>
              <li><a className="hover:underline" href="#products">LapEMS</a></li>
              <li><a className="hover:underline" href="#products">DatEMS</a></li>
              <li><a className="hover:underline" href="#products">EduEMS</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 flex items-center justify-between">
          <div>© {new Date().getFullYear()} ExpertMedia IT</div>
          <Link href="/login" className="hover:underline">Admin</Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="border rounded-md p-4 bg-white dark:bg-neutral-950">
      <div className="text-base font-medium mb-1">{title}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">{description}</div>
    </div>
  );
}

function ServiceCard({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="border rounded-md p-4 bg-white dark:bg-neutral-950">
      <div className="text-base font-medium mb-2">{title}</div>
      <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

export function QuoteCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="border rounded-md p-4 bg-white/70 dark:bg-neutral-900/70">
      <p className="text-sm italic mb-2">“{quote}”</p>
      <div className="text-xs text-gray-600 dark:text-gray-300">{author}</div>
    </div>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border rounded-md p-4 bg-white dark:bg-neutral-950">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-gray-600 dark:text-gray-300">{label}</div>
    </div>
  );
}
