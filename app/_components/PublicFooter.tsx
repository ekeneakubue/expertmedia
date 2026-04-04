import Image from "next/image";
import Link from "next/link";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-6 sm:px-10 py-14 border-t border-white/10 text-sm text-gray-300 bg-neutral-950">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start text-center md:text-left">
        <div className="flex flex-col items-center space-y-4 md:items-start lg:col-span-5">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/images/logo2.png"
              alt="Expert Media Solutions"
              width={120}
              height={26}
              className="h-auto w-auto brightness-110"
            />
          </Link>
          <p className="text-sm leading-6 text-gray-400">
            We help organizations scale with practical, modern technology solutions in automation, analytics, and digital
            enablement.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start lg:col-span-2">
          <div className="font-semibold text-white mb-4 tracking-wide uppercase text-xs">Company</div>
          <ul className="space-y-2.5 md:w-full">
            <li>
              <Link href="/#about" className="hover:text-red-400 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-red-400 transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link href="/#team" className="hover:text-red-400 transition-colors">
                Our Team
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-red-400 transition-colors">
                Our Products
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center md:items-start lg:col-span-2">
          <div className="font-semibold text-white mb-4 tracking-wide uppercase text-xs">Solutions</div>
          <ul className="space-y-2.5 md:w-full">
            <li>
              <Link href="/#services" className="hover:text-red-400 transition-colors">
                RobEMS
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-red-400 transition-colors">
                TalentEMS
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-red-400 transition-colors">
                ScholaEMS
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-red-400 transition-colors">
                EduEMS
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center md:items-start lg:col-span-3">
          <div className="font-semibold text-white mb-4 tracking-wide uppercase text-xs">Contact</div>
          <ul className="space-y-2.5 text-gray-400 md:w-full">
            <li>
              <a href="mailto:help@expertmediasolution.com" className="hover:text-red-400 transition-colors">
                help@expertmediasolution.com
              </a>
            </li>
            <li>
              <a href="tel:+2348034615603" className="hover:text-red-400 transition-colors">
                +234 8034 615 603
              </a>
            </li>
            <li>Nsukka, Enugu State, Nigeria</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-5 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-center sm:justify-between text-gray-400">
        <div className="text-center md:text-left">© {currentYear} ExpertMedia IT. All rights reserved.</div>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://wghp6.wghservers.com:2096/webmaillogout.cgi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition-colors"
          >
            Webmail
          </a>
          <span className="text-white/20">|</span>
          <Link href="/login" className="hover:text-red-400 transition-colors">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
