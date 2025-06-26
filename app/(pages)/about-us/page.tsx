import Cover from '@/components/Cover';
import AvatarCards from '@/components/AvatarCards';
import Image from 'next/image';
import missionImage from '@/public/images/mission.jpg';
import visionImage from '@/public/images/vision.jpg';
import coverImage from '@/public/images/yd_texas1.jpg';
import teamImage from '@/public/images/team.jpg';
import dal from '@/public/images/teams/dal.jpeg';
import khaiboih from '@/public/images/teams/khai_boih.jpeg';
import marysiam from '@/public/images/teams/mary_siam.jpg';
//import muankim from '@/public/images/teams/muan_kim.jpeg';
import mungno from '@/public/images/teams/mungno.jpeg';
import siamnu from '@/public/images/teams/siam_nu.jpeg';

const page: React.FC = () => {
  const missionPointsZomiPicing = [
    'Develop generations of Zomi youths who are passionate about contributing their time, talents, and skills toward the social, economic, and political advancement of the Zomi people.',
    'Raise up leaders who value and uphold the rule of law, committed to justice and ethical leadership.',
  ];

  const missionPointsSiamsinPicing = [
    'Equip students with knowledge and skills appropriate for their age and educational level.',
    'Encourage a mindset of lifelong learning, curiosity, and personal growth.',
  ];

  const officeOfDirector = [
    { name: 'Lia Mary Siam', role: 'Executive Director', image: marysiam },
    { name: 'Tg. Dal', role: 'Assistant Director', image: dal },
    { name: 'Tg. Thomas Mung', role: 'Assistant Director', image: teamImage },
    { name: 'Lia Siam Nu', role: 'Assistant Director', image: siamnu },
  ];

  const educationTeam = [
    { name: 'Khai Boih', role: 'Manager', image: khaiboih },
    { name: 'Nuam Boih', role: 'Assistant', image: teamImage },
  ];

  const trainingTeam = [
    { name: 'Thomas Mung', role: 'Manager', image: teamImage },
    { name: 'Tawi Tawi', role: 'Assistant', image: teamImage }
  ]

  const researchTeam = [
    { name: 'Juni Saw Sawm', role: 'Manager', image: teamImage }
  ]

  const zollTeam = [
    { name: 'Mung No', role: 'Manager', image: mungno },
    { name: 'San Shalom', role: 'Assistant', image: teamImage }
  ]

  const creativeTeam = [
    { name: 'Tung Pi', role: 'Manager', image: teamImage }
  ]

  const financeCommittee = [
    { name: 'Niang Hoih', role: 'Manager', image: teamImage }
  ];

  const hrCommittee = [
    { name: 'Dal Thang', role: 'Manager', image: dal },
    { name: 'Mary Siam', role: 'Assistant', image: marysiam }
  ];

  return (
    <div>
      <Cover title='Who We Are' backgroundImage={coverImage} />
      <section className="py-8 bg-white">
        <div className='max-w-4xl mx-auto px-4'>
          <h1 className="text-3xl font-bold mb-4 text-center">About Us</h1>
          <h2 className="text-xl font-semibold mb-4 text-center">We are change agents</h2>
          <p className="text-lg text-gray-700 mb-4"><strong>Zomi Youth Development</strong> is a global, non-profit initiative committed to supporting and uplifting Zomi youths across the world. As a network of students, scholars, and activists, we are united by a shared purpose: to foster positive change in Zomi communities everywhere.</p>
          <p className="text-lg text-gray-700 mb-4">Driven by the realities of the Zomi Diaspora, our mission is to promote the holistic development of Zomi youths—empowering them to lead, thrive, and shape a brighter future for their communities. We exist to lift each other up and to be a vehicle for growth, connection, and transformation across generations and borders.</p>
        </div>
      </section>
      <section className="py-8 bg-blue-tertiary text-white">
        <div className='max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h1 className="text-3xl font-bold mb-4">Our Mission</h1>
            <p className="text-lg font-semibold mb-4">At <strong>Zomi Youth Development</strong>, our mission is to educate and empower Zomi youths around the world. We aim to provide age-appropriate education and inspire meaningful extracurricular involvement within Zomi communities. We believe in nurturing well-rounded individuals who are not only academically prepared but also socially responsible and community-minded.</p>  
          </div>
          <div>
            <Image 
              src={missionImage} 
              alt="Mission" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div>
              <p className="text-l underline font-semibold mb-2">Zomi Picing</p>
              <p className='font-light italic mb-2'>Raising the Next Generation of Change-Makers</p>
              <ul className="list-disc list-inside space-y-2">
                {missionPointsZomiPicing.map((point, index) => (
                  <li key={index} className="text-lg">{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-l underline font-semibold mb-2">Siamsin Picing</p>
              <p className='font-light italic mb-2'>Fostering Knowledge and Lifelong Learning</p>
              <ul className="list-disc list-inside space-y-2">
                {missionPointsSiamsinPicing.map((point, index) => (
                  <li key={index} className="text-lg">{point}</li>
                ))}
              </ul>
            </div>
        </div>
      </section>
      <section className="py-8 bg-blue-secondary text-white">
        <div className='max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <Image 
              src={visionImage} 
              alt="Vision" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">Our Vision</h1>
            <p className="text-lg font-semibold text-gray-700 mb-4">We envision a future where the Zomi people thrive—socially, economically, and culturally. Our goal is to uplift the Human Development Index of Zomi communities by investing in education, empowering youth, and preserving our rich literature, language, and cultural heritage.​</p>
            <p className="text-lg text-gray-700 mb-4">We believe that lasting change begins with our youths. By equipping them with knowledge, confidence, and a strong sense of identity, we are laying the foundation for a future where the Zomi people can recognize and exercise their right to self-determination—with dignity and unity.​</p>
          </div>
        </div>
      </section>
      <section className="py-8 bg-gray-100">
        <div className='max-w-4xl mx-auto px-4'>
          <h1 className="text-3xl font-bold mb-4 text-center">Our Leadership Team</h1>
          <p className="text-lg text-gray-700 mb-4">YD’s Leadership Team is comprised of the Office of the Director, department leaders, and committees. Together, our Leadership Team support and empower all members of YD to succeed in their activities.​</p>
          <AvatarCards 
            title="Office of the Director" 
            team={officeOfDirector} 
          />
          <AvatarCards 
            title="Education Department" 
            team={educationTeam} 
          />
          <AvatarCards 
            title="Training Department" 
            team={trainingTeam}
          />
          <AvatarCards 
            title="Research Department" 
            team={researchTeam}
          />
          <AvatarCards 
            title="Zomi Language & Literature Department" 
            team={zollTeam}
          />
          <AvatarCards 
            title="Creative Department" 
            team={creativeTeam}
          />
          <AvatarCards 
            title="Finance Committee" 
            team={financeCommittee} 
          />
          <AvatarCards 
            title="Human Resources Committee" 
            team={hrCommittee}
          />
        </div>
      </section>
    </div>
  )
}

export default page;