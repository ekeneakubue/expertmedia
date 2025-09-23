import Link from "next/link";
import { BsRobot, BsYelp } from "react-icons/bs";
import { SiOpensearch, SiSemanticscholar } from "react-icons/si";
import { GrDatabase } from "react-icons/gr";
import { MdOutlineLaptopMac } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import { MdModelTraining } from "react-icons/md";
import { IoGameControllerSharp } from "react-icons/io5";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-6 sm:px-10 lg:px-[11rem] py-16">
        <h2 className="text-2xl font-semibold mb-6 border-l-8 border-solid border-red-500 px-4">Our Services</h2>
        <p>We offer a comprehensive suite of services tailored to meet the unique needs of our clients. </p><br />
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

            <div className="bg-white rounded-md p-[2rem] gap-2">
                <span className="text-red-500 text-[50px] text-center bg-green-500 mb-4">
                    <GrDatabase className="mx-auto mb-8"/>
                </span> 
                <div>
                    <strong className="text-[20px]">DatEMS</strong>
                    <p className="text-sm sm:text-base leading-relaxed text-gray-700 text-justify">
                        At DatEMS, we recognize the critical role that data plays in driving informed 
                        business decisions and enhancing operational efficiency. Our comprehensive services 
                        in data analysis, collection, and delivery are designed to empower organizations 
                        with actionable insights and streamline their data management processes. 
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-md p-[2rem] gap-2">
                <span className="text-red-500 text-[50px] text-center bg-green-500 mb-4">
                    <MdOutlineLaptopMac className="mx-auto mb-8"/>
                </span> 
                <div>
                    <strong className="text-[20px]">LapEMS</strong>
                    <p className="text-sm sm:text-base leading-relaxed text-gray-700 text-justify">
                        Welcome to LapEMS, where cutting-edge technology meets exceptional performance.
                        With LapEMS, we understand that choosing the right laptop is crucial for both 
                        personal and professional needs. Our curated selection of laptops is designed 
                        to cater to a wide range of users, from students and professionals to gamers
                        and creative artists. 
                    </p>
                </div>
            </div>  

            <div className="bg-white rounded-md p-[2rem] gap-2">
                <span className="text-red-500 text-[50px] text-center bg-green-500 mb-4">
                    <MdModelTraining className="mx-auto mb-8"/>
                </span> 
                <div>
                    <strong className="text-[20px]">ProtegEMS</strong>
                    <p className="text-sm sm:text-base leading-relaxed text-gray-700 text-justify">
                        At ProtegEMS, we are commited to nurturing the next generation of talent through 
                        our Protege and Internship Program. This initiative is designed to provide aspiring 
                        professionals with hands-on experience, mentorship, and the skills necessary to 
                        thrive in their chosen fields.
                    </p>
                </div>
            </div>   

            <div className="bg-white rounded-md p-[2rem] gap-2">
                <span className="text-red-500 text-[50px] text-center bg-green-500 mb-4">
                    <BsYelp className="mx-auto mb-8"/>
                </span> 
                <div>
                    <strong className="text-[20px]">SalEMS</strong>
                    <p className="text-sm sm:text-base leading-relaxed text-gray-700 text-justify">
                        At SalEMS, we are dedicated to providing our clients with the latest and most 
                        advanced robotic equipment to drive their success. Our sales team works closely 
                        with customers to understand their unique requirements and recommend the best
                        solutions to meet their needs.
                    </p>
                </div>
            </div>    

            <div className="bg-white rounded-md p-[2rem] gap-2">
                <span className="text-red-500 text-[50px] text-center bg-green-500 mb-4">
                    <IoGameControllerSharp className="mx-auto mb-8"/>
                </span> 
                <div>
                    <strong className="text-[20px]">GamEMS</strong>
                    <p className="text-sm sm:text-base leading-relaxed text-gray-700 text-justify">
                        At EMS, we understand the importance of work-life balance, especially in the fast-paced
                        world of technology and game development. Our game room is designed as a dedicated space 
                        for empoyees to unwind, recharge and foster creativity.
                    </p>
                </div>
            </div>                       
        </div>

        <div className="mt-10">
            <Link href="/" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm">Back to Home</Link>
        </div>
    </main>
  );
}
