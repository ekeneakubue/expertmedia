import Link from "next/link";
import type { Metadata } from "next";
import { PublicNav } from "../_components/PublicNav";
import { BsRobot, BsYelp } from "react-icons/bs";
import { SiOpensearch, SiSemanticscholar } from "react-icons/si";
import { GrDatabase } from "react-icons/gr";
import { MdOutlineLaptopMac } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import { MdModelTraining } from "react-icons/md";
import { IoGameControllerSharp } from "react-icons/io5";
import { ScrollToTop } from "../_components/ScrollToTop";
import { PublicFooter } from "../_components/PublicFooter";

export const metadata: Metadata = {
  title: "Our Services | Expert Media Solutions",
  description:
    "ScholaEMS, TalentEMS, RobEMS, EduEMS, DatEMS, and more — practical IT, robotics, data, and talent programs from Expert Media Solutions.",
};

const heroPattern =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

export default function ServicesPage() {
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
            Our services
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            We offer a comprehensive suite of programs and solutions — from scholarships and talent development to
            robotics, data, devices, and more — tailored to the needs of our clients and communities.
          </p>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      </section>

      <main id="main" className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold border-l-8 border-red-500 pl-4 sm:text-3xl">What we deliver</h2>
          <p className="mt-3 text-sm text-neutral-600 sm:text-base">
            Explore each area below. Reach out through{" "}
            <Link href="/contacts" className="font-medium text-red-600 underline-offset-2 hover:underline">
              Contact
            </Link>{" "}
            when you&apos;re ready to scope a project.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <div className="rounded-md bg-white p-8 shadow-sm">
            <span className="mb-6 block text-center text-[50px] text-red-500">
              <SiSemanticscholar className="mx-auto" />
            </span>
            <div>
              <strong className="text-xl">ScholaEMS</strong>
              <p className="mt-2 text-justify text-sm leading-relaxed text-gray-700 sm:text-base">
                With ScholarEMS, we are commited to fostering education and empowering Individuals through our
                scholarship scheme. This initiative aims to provide financial assistance to exceptional students who
                deminstrates excellence, leadership potentials, and a commitment to their skill.
              </p>
            </div>
          </div>

          <div className="rounded-md bg-white p-8 shadow-sm">
            <span className="mb-6 block text-center text-[50px] text-red-500">
              <SiOpensearch className="mx-auto" />
            </span>
            <div>
              <strong className="text-xl">TalentEMS</strong>
              <p className="mt-2 text-justify text-sm leading-relaxed text-gray-700 sm:text-base">
                At EMS, we belive that our greatest asset is our people. Our talent showcase a dedicated section
                designed to highlight and celebrate the diverse skills, creativity and achievements of our team
                members.
              </p>
            </div>
          </div>

          <div className="rounded-md bg-white p-8 shadow-sm">
            <span className="mb-6 block text-center text-[50px] text-red-500">
              <BsRobot className="mx-auto" />
            </span>
            <div>
              <strong className="text-xl">RobEMS</strong>
              <p className="mt-2 text-justify text-sm leading-relaxed text-gray-700 sm:text-base">
                RobEMS is dedicated to advancing the field of robotics through innovative solutions and cutting-edge
                technology. With RobEMS, we specialize in designing and implementing robotic systems tailored to meet
                the unique needs of our clients. Our team of experts combines extensive knowledge in engineering,
                automation, and artificial intelligence to deliver comprehensive solutions across various sectors,
                including manufacturing, healthcare, logistics, and agriculture.
              </p>
            </div>
          </div>

          <div className="rounded-md bg-white p-8 shadow-sm">
            <span className="mb-6 block text-center text-[50px] text-red-500">
              <GiNotebook className="mx-auto" />
            </span>
            <div>
              <strong className="text-xl">EduEMS</strong>
              <p className="mt-2 text-justify text-sm leading-relaxed text-gray-700 sm:text-base">
                At EduEMS, we belive that knowledge is the foundation of innovation and success. Our educational
                materials section is dedicated to providing valuable resources that empower individuals and
                organisations to enhance their skill, stay informed about industry trends, and informed decisions.
                whether you are a student, a professional, or an educator our curated collections of educational
                materials is designed to meet your needs.
              </p>
            </div>
          </div>

          <div className="rounded-md bg-white p-8 shadow-sm">
            <span className="mb-6 block text-center text-[50px] text-red-500">
              <GrDatabase className="mx-auto" />
            </span>
            <div>
              <strong className="text-xl">DatEMS</strong>
              <p className="mt-2 text-justify text-sm leading-relaxed text-gray-700 sm:text-base">
                At DatEMS, we recognize the critical role that data plays in driving informed business decisions and
                enhancing operational efficiency. Our comprehensive services in data analysis, collection, and delivery
                are designed to empower organizations with actionable insights and streamline their data management
                processes.
              </p>
            </div>
          </div>

          <div className="rounded-md bg-white p-8 shadow-sm">
            <span className="mb-6 block text-center text-[50px] text-red-500">
              <MdOutlineLaptopMac className="mx-auto" />
            </span>
            <div>
              <strong className="text-xl">LapEMS</strong>
              <p className="mt-2 text-justify text-sm leading-relaxed text-gray-700 sm:text-base">
                Welcome to LapEMS, where cutting-edge technology meets exceptional performance. With LapEMS, we
                understand that choosing the right laptop is crucial for both personal and professional needs. Our
                curated selection of laptops is designed to cater to a wide range of users, from students and
                professionals to gamers and creative artists.
              </p>
            </div>
          </div>

          <div className="rounded-md bg-white p-8 shadow-sm">
            <span className="mb-6 block text-center text-[50px] text-red-500">
              <MdModelTraining className="mx-auto" />
            </span>
            <div>
              <strong className="text-xl">ProtegEMS</strong>
              <p className="mt-2 text-justify text-sm leading-relaxed text-gray-700 sm:text-base">
                At ProtegEMS, we are commited to nurturing the next generation of talent through our Protege and
                Internship Program. This initiative is designed to provide aspiring professionals with hands-on
                experience, mentorship, and the skills necessary to thrive in their chosen fields.
              </p>
            </div>
          </div>

          <div className="rounded-md bg-white p-8 shadow-sm">
            <span className="mb-6 block text-center text-[50px] text-red-500">
              <BsYelp className="mx-auto" />
            </span>
            <div>
              <strong className="text-xl">SalEMS</strong>
              <p className="mt-2 text-justify text-sm leading-relaxed text-gray-700 sm:text-base">
                At SalEMS, we are dedicated to providing our clients with the latest and most advanced robotic
                equipment to drive their success. Our sales team works closely with customers to understand their unique
                requirements and recommend the best solutions to meet their needs.
              </p>
            </div>
          </div>

          <div className="rounded-md bg-white p-8 shadow-sm md:col-span-2">
            <span className="mb-6 block text-center text-[50px] text-red-500">
              <IoGameControllerSharp className="mx-auto" />
            </span>
            <div>
              <strong className="text-xl">GamEMS</strong>
              <p className="mt-2 text-justify text-sm leading-relaxed text-gray-700 sm:text-base">
                At EMS, we understand the importance of work-life balance, especially in the fast-paced world of
                technology and game development. Our game room is designed as a dedicated space for empoyees to unwind,
                recharge and foster creativity.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />

      <ScrollToTop />
    </div>
  );
}
