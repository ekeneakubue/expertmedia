import Link from "next/link";
import Image from "next/image";
import { GrStatusGood } from "react-icons/gr";
import { MdLocationCity } from "react-icons/md";
import { BsRobot } from "react-icons/bs";
import { SiOpensearch, SiSemanticscholar } from "react-icons/si";
import { GiNotebook } from "react-icons/gi";
import { FaEnvelope, FaPhoneAlt, FaFacebook, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MobileMenu } from "./_components/MobileMenu";
import { HeroSlider } from "./_components/HeroSlider";
import { ScrollToTop } from "./_components/ScrollToTop";
import { PublicFooter } from "./_components/PublicFooter";
import { getHeroImageUrlsForHome } from "@/lib/hero-images";
import { getBoardMembersForHome } from "@/lib/team-members";
import { getFeaturedProductsForHome } from "@/lib/products-public";
import { ProductCard } from "./products/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const heroImages = await getHeroImageUrlsForHome();
  const boardMembers = await getBoardMembersForHome();
  const featuredProducts = await getFeaturedProductsForHome();
  return (
    <div className="min-h-screen">
      {/* Navbar + hero share exactly one viewport height */}
      <div className="h-screen flex flex-col">
      <header className="shrink-0 w-full bg-white top-0 z-10">
        <div className="w-full mx-auto flex items-center justify-between md:justify-center px-6 py-3 relative">
          <Link href="/" className="shrink-0 leading-none">
            <Image
              src="/images/logo.png"
              alt="Expert Media Solutions"
              width={280}
              height={84}
              className="h-14 w-auto sm:h-16 md:h-[4.25rem] lg:h-[4.25rem]"
              priority
              quality={100}
            />
          </Link>
          <MobileMenu
            links={[
              { href: '#about', label: 'About Us' },
              { href: '/services', label: 'Services' },
              { href: '/products', label: 'Our Products' },
              { href: '/team', label: 'Our Team' },
              { href: '#gallery', label: 'Gallery' },
              { href: '/contact', label: 'Contact Us' },
              { href: '/login', label: 'Login' },
            ]}
          />
        </div>
        <div className="mt-0 hidden sm:flex items-center sm:w-full justify-center  text-xs bg-red-400">
          <nav className="flex items-center">
            <Link href="#about" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-l-2 border-l-amber-50 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">About Us</Link>
            <Link href="/services" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Services</Link>
            <Link href="/products" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Our Products</Link>
            <Link href="/team" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Our Team</Link>
            <Link href="#gallery" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Gallery</Link>
            <Link href="/contacts" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Contact Us</Link>
            <Link href="/login" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Login</Link>
          </nav>
        </div>
      </header>

      <HeroSlider images={heroImages}>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
          Welcome to Expert Media Solutions
        </h1>
        <p className="mt-4 text-gray-200 text-base sm:text-lg">
          Your trusted IT solutions partner. We help you transform operations with automation, analytics, enablement, and education tailored to your goals.
        </p>
        <div className="pt-6">
          <Link href="#services" className="inline-flex items-center justify-center rounded-md bg-red-500 text-white px-6 py-3 text-sm font-medium hover:bg-red-600">
            Find Your Solution
          </Link>
        </div>
      </HeroSlider>
      </div>

      {/* About Expert Media */}
      <section id="about" className="px-6 sm:px-10 lg:px-20 py-16 min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 border-l-8 border-solid border-red-500 px-4">About Us</h2>
          <p>
            In today&apos;s fast-paced digital landscape, having the right technology solutions is essential for 
            success. At <strong>Expert Media Solutions</strong>, we specialize in providing tailored IT 
            solutions that empower businesses to thrive. As a leading provider of robotic automation, sales 
            enablement, data analysis, and educational resources, we offer a comprehensive suite of services 
            tailored to meet the unique needs of our clients.
          </p><br />
          <p>
            At <strong>Expert Media Solutions</strong>, we are a team of passionate IT professionals dedicated 
            to helping businesses thrive in the digital age. Our mission is to provide innovative and tailored 
            IT solutions that drive efficency, productivity, and growth. 
          </p><br /><br />

          <strong className="text-[20px]">Our team specializes in a wide range of IT solutions, including;</strong>
          <br /><br />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 items-start">
              <div className="text-red-500 text-[30px]"><GrStatusGood /></div>
              <p>
                <strong>Robotic Automation: </strong>
                Streamline your operations with advanced robotic systems that automate repetitive tasks, reduce errors and 
                increase throughput.
              </p>
            </div>

            <div className="flex gap-4 items-start">
              <div className="text-red-500 text-[30px]"><GrStatusGood /></div>
              <p>
                <strong>Educational Resources: </strong>
                Stay ahead of the curve with our comprehensive educational resources, including online courses,
                webinners, industry report, and white papers.
              </p>
            </div>

            <div className="flex gap-4 items-start">
              <div className="text-red-500 text-[30px]"><GrStatusGood /></div>
              <p>
                <strong>Data Analysis: </strong>
                Unlock the power of your data with our advanced analitics solutions.
                Our team of Data Scientists and Analysts will help you collect, organize
                and interprete your data to uncover valuable insights and derive strategic 
                decision-making.
          </p>
        </div>

            <div className="flex gap-4 items-start">
              <div className="text-red-500 text-[30px]"><GrStatusGood /></div>
              <p>
                <strong>Hardware Solutions: </strong>
                We offer a range of high-performance laptops, desktops, and peripherals to support
                your IT infrastructure and ensure your team has the tools they need to succeed.
              </p>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/about"
              className="px-6 mt-2 bg-red-500 rounded py-2 text-gray-50 w-full sm:w-auto text-center"
            >
              More About EMS
            </Link>
          </div>
        </div>
      </section>

      

      {/* Our Services */}
      <section id="services" className="px-6 sm:px-10 lg:px-20 py-16 min-h-[60vh] bg-gray-100 dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 border-l-8 border-solid border-red-500 px-4">Our Services</h2>
          <p>We offer a comprehensive suite of services tailored to meet the unique needs of our clients. </p>
          <br /><br />
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
              <div className="bg-white rounded-md p-[2rem] gap-2">
                <span className="text-red-500 text-[50px] text-center bg-green-500 mb-4">
                  <SiSemanticscholar className="mx-auto mb-8"/>
                </span> 
                <div>
                  <strong className="text-[20px]">ScholaEMS</strong>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 text-justify">
                    With ScholarEMS, we are commited to fostering education and empowering Individuals through 
                    our scholarship scheme. This initiative aims to provide financial assistance to exceptional 
                    students who deminstrates excellence, leadership potentials, and a commitment to their skill.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-md p-[2rem] gap-2">
                <span className="text-red-500 text-[50px] text-center bg-green-500 mb-4">
                  <SiOpensearch className="mx-auto mb-8"/>
                </span> 
                <div>
                  <strong className="text-[20px]">TalentEMS</strong>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 text-justify">
                    At EMS, we belive that our greatest asset is our people. Our talent showcase a dedicated 
                    section designed to highlight and celebrate the diverse skills, creativity and achievements 
                    of our team members.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-md p-[2rem] gap-2">
                <span className="text-red-500 text-[50px] text-center bg-green-500 mb-4">
                  <BsRobot className="mx-auto mb-8"/>
                </span> 
                <div>
                  <strong className="text-[20px]">RobEMS</strong>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 text-justify">
                    RobEMS is dedicated to advancing the field of robotics through innovative solutions and 
                    cutting-edge technology. With RobEMS, we specialize in designing and implementing robotic 
                    systems tailored to meet the unique needs of our clients. Our team of experts combines 
                    extensive knowledge in engineering, automation, and artificial intelligence to deliver 
                    comprehensive solutions across various sectors, including manufacturing, healthcare, logistics, 
                    and agriculture. 
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-md p-[2rem] gap-2">
                <span className="text-red-500 text-[50px] text-center bg-green-500 mb-4">
                  <GiNotebook className="mx-auto mb-8"/>
                </span> 
                <div>
                  <strong className="text-[20px]">EduEMS</strong>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 text-justify">
                    At EduEMS, we belive that knowledge is the foundation of innovation and success.
                    Our educational materials section is dedicated to providing valuable resources
                    that empower individuals and organisations to enhance their skill, stay informed 
                    about industry trends, and informed decisions. whether you are a student, a 
                    professional, or an educator our curated collections of educational materials is 
                    designed to meet your needs.
                  </p>
                </div>
          </div>
        </div>
            <div className="flex justify-center mt-4">            
              <Link href="/services" className="px-6 mt-8 bg-red-500 rounded py-2 text-gray-50 w-full sm:w-auto text-center">View More ...</Link>
            </div>
          </div>
        </div>
      </section>      

      {/* Our Products — featured only, from database */}
      <section id="products" className="px-6 sm:px-10 lg:px-20 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-2 border-l-8 border-solid border-red-500 px-4">Our Products</h2>
          <p className="text-gray-700 dark:text-neutral-300 text-sm mb-8 px-1">
            Featured items from our catalog — pricing and details on each product page.
          </p>
          {featuredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/80 px-8 py-14 text-center dark:border-neutral-600 dark:bg-neutral-900/40">
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                No featured products yet. Browse the full catalog or contact us for what you need.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-block px-6 bg-red-500 rounded py-2 text-sm font-medium text-gray-50 hover:bg-red-600"
              >
                View catalog
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8 list-none p-0 m-0">
              {featuredProducts.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-10 flex justify-center">
            <Link href="/products" className="px-6 mt-8 bg-red-500 rounded py-2 text-gray-50 w-full sm:w-auto text-center">
              View all Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Board members (from database via Neon) */}
      <section id="team" className="px-6 sm:px-10 lg:px-20 py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-3 border-l-8 border-solid border-red-500 px-4">Board Members</h2>
          <p className="text-gray-700 dark:text-gray-200 text-sm mb-8 max-w-2xl">
            Guiding our mission, values, and long-term strategy.
          </p>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {boardMembers.map((member) => (
              <li
                key={`board-${member.name}-${member.imageUrl}`}
                className="group overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pt-24 pb-5 px-5">
                    <p className="text-lg font-semibold text-white">{member.name}</p>
                    {member.memberRole ? (
                      <p className="mt-1 text-sm leading-snug text-white/90">{member.memberRole}</p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <Link
              href="/team"
              className="px-6 mt-2 bg-red-500 rounded py-2 text-gray-50 w-full sm:w-auto text-center"
            >
              View full team →
            </Link>
          </div>
        </div>
      </section>      

      {/* Gallery */}
      <section id="gallery" className="px-6 sm:px-10 lg:px-20 py-16 dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto grid gap-3">
          <h2 className="text-2xl font-semibold mb-6 border-l-8 border-solid border-red-500 px-4">Gallery</h2>
          <p className="text-gray-700 dark:text-gray-200 text-sm">Snapshots from projects, events, and community work.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Image src="/images/gallery/stc1.JPG" alt="Gallery image 1" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc2.JPG" alt="Gallery image 2" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc3.JPG" alt="Gallery image 3" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc4.JPG" alt="Gallery image 4" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc5.JPG" alt="Gallery image 5" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc6.JPG" alt="Gallery image 6" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc7.JPG" alt="Gallery image 7" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc8.JPG" alt="Gallery image 8" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc9.JPG" alt="Gallery image 9" width={600} height={400} className="w-full h-auto" />
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/gallery"
              className="px-6 mt-8 bg-red-500 rounded py-2 text-gray-50 w-full sm:w-auto text-center"
            >
              View More ...
            </Link>
          </div>
        </div>
      </section>

      

      {/* Our Contacts */}
      <section id="contacts" className="px-6 sm:px-10 lg:px-[11rem] py-16 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-6 border-l-8 border-solid border-red-500 px-4">Contact Us</h2>
        <p className="text-gray-700 dark:text-gray-200 text-sm">
          Let’s plan your next milestone
        </p><br /><br />
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-md py-[4rem] flex gap-2 px-[2rem]">
              <span className="text-green-800 text-[50px]">
                <FaPhoneAlt />
              </span> 
              <div>
                <strong>Call Us</strong>
                <p>+234 8034 615 603</p>
              </div>
            </div>
            <div className="rounded-md py-[4rem] flex gap-2 px-[2rem] border-gray-300 border-[1px]">
              <span className="text-red-500 text-[50px]">
                <MdLocationCity/>
              </span> 
              <div>
                <strong>Office Address</strong>
                <p>1, SCM Close, Onuiyi, Nsukka, Enugu State, Nigeria</p>
              </div>
            </div>
            <div className="bg-white rounded-md py-[4rem] flex gap-2 px-[2rem]">
              <span className="text-yellow-500 text-[50px]">
                <FaEnvelope />
              </span> 
              <div>
                <strong>Email Address</strong>
                <p>help@expertmediasolution.com</p>
              </div>
            </div> 
            <div className="rounded-md py-[4rem] flex gap-2 px-[2rem] border-gray-300 border-[1px]">
              <span className="text-blue-500 text-[50px]">
                <FaFacebook />
              </span> 
              <div>
                <strong>Facebook</strong>
                <p>Expert Media Solutions</p>
              </div>
            </div>
            <div className="bg-white rounded-md py-[4rem] flex gap-2 px-[2rem]">
              <span className="text-blue-300 text-[50px]">
                <FaLinkedinIn />
              </span>              
              <div>
                <strong>LinkedIn</strong>
                <p>https://www.linkedin.com/company</p>
              </div>
            </div>
            <div className="rounded-md py-[4rem] flex gap-2 px-[2rem] border-gray-300 border-[1px]">
              <span className="text-red-700 text-[50px]">
                <FaInstagram />
              </span>  
              <div>
                <strong>Instagram</strong>
                <p>help@expertmediasolution.com</p>
              </div>
            </div> 
          </div>
        </div>

      </section>


      <PublicFooter />
      <ScrollToTop />
    </div>
  );
}

// FeatureCard and ServiceCard removed (unused)

// Removed unused local components to satisfy Next.js allowed page exports
