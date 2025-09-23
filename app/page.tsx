import Link from "next/link";
import Image from "next/image";
import { GrStatusGood } from "react-icons/gr";
import { MdLocationCity } from "react-icons/md";
import { BsRobot } from "react-icons/bs";
import { FaEnvelope, FaPhoneAlt, FaFacebook, FaLinkedinIn, FaInstagram} from "react-icons/fa";
import { MobileMenu } from "./_components/MobileMenu";
import { HeroSlider } from "./_components/HeroSlider";
import { ScrollToTop } from "./_components/ScrollToTop";

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
            <a href="#contacts" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Contact Us</a>
            <a href="/login" className="min-w-[140px] cursor-pointer inline-block text-center text-[16px] py-4 text-white border-r-2 border-r-amber-50 transition-colors duration-200 hover:text-white hover:bg-red-500">Login</a>
          </nav>
        </div>
      </header>

      {/* Hero Slider */}
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

      {/* About Expert Media */}
      <section id="about" className="px-16sm:px-10 py-16 min-h-[100vh] px-[10rem]">
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
          <div className="grid grid-cols-2 gap-8">
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
        </div>
      </section>

      

      {/* Our Services */}
      <section id="services" className="px-6 sm:px-10 py-16 min-h-[100vh] bg-gray-100 dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 border-l-8 border-solid border-red-500 px-4">Our Services</h2>
          <br /><br />
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-md p-[2rem] gap-2">
                <span className="text-red-500 text-[50px] text-center bg-green-500 mb-4">
                  <BsRobot className="mx-auto mb-8"/>
                </span> 
                <div>
                  <strong className="text-[20px]">RobEMS</strong>
                  <p className="text-justify">
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
                  <BsRobot className="mx-auto mb-8"/>
                </span> 
                <div>
                  <strong className="text-[20px]">RobEMS</strong>
                  <p className="text-justify">
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
                  <BsRobot className="mx-auto mb-8"/>
                </span> 
                <div>
                  <strong className="text-[20px]">RobEMS</strong>
                  <p className="text-justify">
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
                  <BsRobot className="mx-auto mb-8"/>
                </span> 
                <div>
                  <strong className="text-[20px]">RobEMS</strong>
                  <p className="text-justify">
                    RobEMS is dedicated to advancing the field of robotics through innovative solutions and 
                    cutting-edge technology. With RobEMS, we specialize in designing and implementing robotic 
                    systems tailored to meet the unique needs of our clients. Our team of experts combines 
                    extensive knowledge in engineering, automation, and artificial intelligence to deliver 
                    comprehensive solutions across various sectors, including manufacturing, healthcare, logistics, 
                    and agriculture. 
                  </p>
                </div>
              </div>              
              
            </div>
            <div className="flex justify-center mt-4">            
              <button className="px-4 mt-[2rem] bg-red-500 rounded py-2 text-gray-50 w-[20%] mx-auto">View More ...</button>
            </div>
          </div>
        </div>
      </section>
     

      {/* Our Team */}
      <section id="team" className="px-6 min-h-[100vh] sm:px-10 py-16">
        <div className="max-w-6xl mx-auto grid gap-3">
          <h2 className="text-2xl font-semibold mb-6 border-l-8 border-solid border-red-500 px-4">Our Team</h2>
          <p className="text-gray-700 dark:text-gray-200 text-sm">Meet the professionals behind our solutions.</p>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div><Image src="/images/team/gabriel.png" alt="Gabriel" width={300} height={300} className="w-full h-auto" /></div>              
            </div>

            <div>
              <div><Image src="/images/team/emeka.png" alt="Emeka" width={300} height={300} className="w-full h-auto" /></div>              
            </div>

            <div>
              <div><Image src="/images/team/emma.png" alt="Emma" width={300} height={300} className="w-full h-auto" /></div>              
            </div>

            <div>
              <div><Image src="/images/team/ekene.png" alt="Ekene" width={300} height={300} className="w-full h-auto" /></div>              
            </div>

          </div>
        </div>
      </section>

       {/* Board Members */}
       <section id="board" className="px-6 min-h-[100vh] bg-gray-100 sm:px-10 py-16">
        <div className="max-w-6xl mx-auto grid gap-3">
          <h2 className="text-2xl font-semibold mb-6 border-l-8 border-solid border-red-500 px-4">Board Members</h2>
          <p className="text-gray-700 dark:text-gray-200 text-sm">Guiding our mission and long-term strategy.</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div><Image src="/images/board/chukwuma.png" alt="Chukwuma" width={380} height={420} className="w-full h-auto" /></div>              
            </div>

            <div>
              <div><Image src="/images/board/nnamdi.png" alt="Nnamdi" width={380} height={420} className="w-full h-auto" /></div>              
            </div>

            <div>
              <div><Image src="/images/board/rotanna.png" alt="Rotanna" width={380} height={420} className="w-full h-auto" /></div>              
            </div>
          </div>
        </div>
      </section>

      
      
      {/* Gallery */}
      <section id="gallery" className="px-6 min-h-[100vh] sm:px-10 py-16 dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto grid gap-3">
          <h2 className="text-2xl font-semibold mb-6 border-l-8 border-solid border-red-500 px-4">Gallery</h2>
          <p className="text-gray-700 dark:text-gray-200 text-sm">Snapshots from projects, events, and community work.</p>
          <div className="grid grid-cols-3 gap-4">
            <Image src="/images/gallery/stc1.jpg" alt="Gallery image 1" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc2.jpg" alt="Gallery image 2" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc3.jpg" alt="Gallery image 3" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc4.jpg" alt="Gallery image 4" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc5.jpg" alt="Gallery image 5" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc6.jpg" alt="Gallery image 6" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc7.jpg" alt="Gallery image 7" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc8.jpg" alt="Gallery image 8" width={600} height={400} className="w-full h-auto" />
            <Image src="/images/gallery/stc9.jpg" alt="Gallery image 9" width={600} height={400} className="w-full h-auto" />
          </div>
          <button className="px-4 mt-[2rem] bg-red-500 rounded py-2 text-gray-50 w-[20%] mx-auto ">View More ...</button>
        </div>
      </section>

      

      {/* Our Contacts */}
      <section id="contacts" className="px-16sm:px-10 py-16 min-h-[100vh] bg-gray-100 px-[10rem]">
        <h2 className="text-2xl font-semibold mb-6 border-l-8 border-solid border-red-500 px-4">Contact Us</h2>
        <p className="text-gray-700 dark:text-gray-200 text-sm">
          Let’s plan your next milestone
        </p><br /><br />
        <div>
          <div className="grid grid-cols-3">
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
      <ScrollToTop />
    </div>
  );
}

// FeatureCard and ServiceCard removed (unused)

// Removed unused local components to satisfy Next.js allowed page exports
