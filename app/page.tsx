
import Image from "next/image";
import Link from "next/link";
import Hero from "./components/Hero";
import VideoBox from "./components/VideoBox";
import AboutUsImg from "@/public/images/img4.png";
import ProgramImg from "@/public/images/volunteers.jpg";
import AnimateCounters from "./components/AnimateCounter";

interface Counter {
  end: number;
  text: string;
}

interface Program {
  name: string;
  description: string;
  image: StaticImageData;
}

export default function Home() {
  const themeSongYoutubeLink = 'https://www.youtube.com/embed/PLuHDYufJRM?si=VeGebn5-6uru1Ns5';

  const counters: Counter[] = [
    { end: 100, text: 'YD Workforce' },
    { end: 3, text: 'Countries Respresented' },
    { end: 40, text: 'Outside Volunteers' }
  ];

const programs: Program[] = [
    { name: 'Youth Leadership Program', description: 'Empowering young leaders through training and mentorship.', image: ProgramImg },
    { name: 'Community Outreach', description: 'Engaging with the community to provide support and resources.', image: ProgramImg },
    { name: 'Educational Workshops', description: 'Offering workshops on various educational topics.', image: ProgramImg },
  ];

  return (
    <main>
      <Hero />
      <section id="video-section" className='py-8'>
        <div className='container mx-auto'>
            <VideoBox src={themeSongYoutubeLink}/>
        </div>
      </section>
      <AnimateCounters counters={counters} />
      <section className="bg-blue-secondary text-white py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center ">
            <div>
                <Image 
                  src={AboutUsImg} 
                  alt="About Us" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
            </div>
            <div>
                <h2 className="text-3xl font-bold mb-4">About Us</h2>
                <p className="text-lg font-semibold text-gray-700 mb-4">Zomi Youth Development is part of a non-profit youth organization that aims to support and uplift the Zomi youths around the world.</p>
                <p className="text-lg text-gray-700 mb-4">Our slogan is “Zomi Picing, Siamsin Picing!” Perfectly capturing the shared vision that our member body has.</p>
                <Link href="/about-us">
                    <button className='bg-sky-500'>Learn More About YD</button>
                </Link>
            </div>
        </div>
      </section>
      <section className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold mb-2">What We Do</h2>
                    <h3 className="text-xl font-semibold mb-4">Our Programs</h3>
                </div>
                <div>
                    <p className="text-lg text-gray-700 mb-4">Our programs and initiatives are designed to empower the youth through education, community engagement, and leadership development. We believe in the power of technology and innovation to transform lives and communities.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programs.map((program, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
                        <Image
                        src={program.image}
                        alt={program.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-2xl font-semibold mb-2">{program.name}</h3>
                        <p className="text-gray-700">{program.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </main>
  );
}
