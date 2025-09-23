import Link from "next/link";
import Image from "next/image";

export default function ServicesPage() {
  return (
    <main className="min-h-screen px-6 sm:px-10 lg:px-20 py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Our Services</h1>
        <p className="mt-2 text-gray-600">Explore the full catalog of what we offer.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { title: "Robotic Automation", desc: "Automate tasks and increase throughput.", img: "/images/services/robotics.jpg" },
          { title: "Sales Enablement", desc: "Equip teams to win more deals.", img: "/images/services/sales.jpg" },
          { title: "Data Analysis", desc: "Turn data into insights.", img: "/images/services/data.jpg" },
          { title: "Cloud & DevOps", desc: "Build, ship, and scale reliably.", img: "/images/services/cloud.jpg" },
          { title: "Security", desc: "Protect identities, data, and systems.", img: "/images/services/security.jpg" },
          { title: "Education", desc: "Upskill with courses and workshops.", img: "/images/services/education.jpg" },
        ].map((s) => (
          <article key={s.title} className="border rounded-md overflow-hidden bg-white dark:bg-neutral-900">
            <div className="aspect-[16/9] relative">
              <Image src={s.img} alt={s.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-medium">{s.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
            </div>
          </article>
        ))}
      </section>

      <div className="mt-10">
        <Link href="/" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm">Back to Home</Link>
      </div>
    </main>
  );
}
