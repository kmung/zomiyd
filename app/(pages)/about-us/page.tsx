import missionImage from '@/public/images/mission.jpg';
import visionImage from '@/public/images/vision.jpg';
import coverImage from '@/public/images/yd_texas1.jpg';
import teamImage from '@/public/images/team.jpg';
import Cover from '../../components/Cover';
import AvatarCards from '../../components/AvatarCards';
import Image from 'next/image';
import dal from '@/public/images/teams/dal.jpeg';
import khaiboih from '@/public/images/teams/khai_boih.jpeg';
import marysiam from '@/public/images/teams/mary_siam.png';
import muankim from '@/public/images/teams/muan_kim.jpeg';
import mungno from '@/public/images/teams/mungno.jpeg';
import siamnu from '@/public/images/teams/siam_nu.jpeg';

const page: React.FC = () => {
  const missionPoints = [
    'Raise up generations of Zomi youths who will have a passion to meaningfully contribute their time and skills to increase the social, economic, and political development of the Zomi people.',
    'Raise up leaders who understand and abide by the rule of law.',
  ];

  const additionalPoints = [
    'For students to have knowledge and skills that complement their age and studies.',
    'Cultivate a heart of life-long learning.',
  ];

  const officeOfDirector = [
    { name: 'Mary Siam', role: 'Executive Director', image: marysiam },
    { name: 'Tg. Dal', role: 'Assistant Director', image: dal },
    { name: 'Tg. Thomas Mung', role: 'Assistant Director', image: teamImage },
    { name: 'Lia Siam Nu', role: 'Assistant Director', image: siamnu },
  ];

  const educationTeam = [
    { name: 'Khai Boih', role: 'Manager', image: khaiboih },
    { name: 'Nuam Boih', role: 'Assistant Manager', image: teamImage },
    { name: 'Khai No', role: 'IT Course Lecturer', image: teamImage },
    { name: 'Kam', role: 'IT Course Lead', image: teamImage },
    { name: 'Mua Muang', role: 'IT Course Lead', image: teamImage },
    { name: 'Dr. Tuang, PhD', role: 'Mentorship Program Mentor', image: teamImage },
    { name: 'San Seng', role: 'Mentorship Program Lead', image: teamImage },
    { name: 'Pum Ciin', role: 'Mentorship Program Lead Assistant', image: teamImage },
    { name: 'Dim Dim', role: 'ELL Lead', image: teamImage },
    { name: 'Nuam Boih', role: 'ELL Lead Assistant', image: teamImage },
    { name: 'Siam Nu', role: 'Profession Program Lead', image: teamImage },
  ];

  const trainingTeam = [
    { name: 'Thomas Mung', role: 'Manager', image: teamImage },
  ]

  const researchTeam = [
    { name: 'Juni Saw Sawm', role: 'Manager', image: teamImage },
    { name: 'Dal Thang', role: 'Lead', image: dal },
  ]

  const zollTeam = [
    { name: 'Mung No', role: 'Manager', image: mungno },
  ]

  const creativeTeam = [
    { name: 'Tung Pi', role: 'Manager', image: teamImage },
    { name: 'Sang Nu', role: 'Lead', image: teamImage },
  ]

  const financeCommittee = [
    { name: 'Niang Hoih', role: 'Manager', image: teamImage },
    { name: 'Khai Boih', role: 'Fundraising Project Lead', image: teamImage },
    { name: 'Muan Kim', role: 'Payroll & Taxes Specialist', image: muankim },
    { name: 'Nuam Boih', role: 'Treasurer Lead', image: teamImage },
    { name: 'Nua Nuam', role: 'Accountant Lead', image: teamImage },
  ];

  const hrCommittee = [
    { name: 'Dal Thang', role: 'Manager', image: dal },
    { name: 'Mary Siam', role: 'Assistant', image: marysiam },
    { name: 'Dim Nem', role: 'Work Hour Lead', image: teamImage },
  ];

  return (
    <div>
      <Cover title='Who We Are' backgroundImage={coverImage} />
      <section className="py-8 bg-white">
        <div className='max-w-4xl mx-auto px-4'>
          <h1 className="text-3xl font-bold mb-4 text-center">About Us Overview</h1>
          <h2 className="text-xl font-semibold mb-4 text-center">We are change agents</h2>
          <p className="text-lg text-gray-700 mb-4">Zomi Youth Development is part of a non-profit youth organization that aims to support and uplift the Zomi youths around the world. We are a collective of students, scholars, and activists with a shared interest in positively influencing the many Zomi communities scattered across the globe.</p>
          <p className="text-lg text-gray-700 mb-4">Our work focuses on the holistic development of Zomi youths scattered across the globe due to the Zomi Diaspora. We exist to empower each other and to be the vehicle that drives the positive development of Zomi communities.</p>
        </div>
      </section>
      <section className="py-8 bg-blue-tertiary text-white">
        <div className='max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h1 className="text-3xl font-bold mb-4">Our Mission</h1>
            <p className="text-lg font-semibold mb-4">To educate Zomi youths in basic education respective to their age, and encourage them to acquire extra curricular involvements in the Zomi communities.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-l underline font-semibold mb-2">Zomi Picing</p>
                <ul className="list-disc list-inside space-y-2">
                  {missionPoints.map((point, index) => (
                    <li key={index} className="text-lg">{point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-l underline font-semibold mb-2">Siamsin Picing</p>
                <ul className="list-disc list-inside space-y-2">
                  {additionalPoints.map((point, index) => (
                    <li key={index} className="text-lg">{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <Image 
              src={missionImage} 
              alt="Mission" 
              className="w-full h-auto rounded-lg shadow-md"
            />
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
            <p className="text-lg font-semibold text-gray-700 mb-4">To uplift the Human Development Index of the Zomi people, as well as preserve and enhance the literature, language and its culture.​</p>
            <p className="text-lg text-gray-700 mb-4">We envision a future where the Zomi people are able to recognize and exercise their right to self-determination. We believe that in order to achieve our vision it starts with our youths.​</p>
          </div>
        </div>
      </section>
      <section className="py-8 bg-gray-100">
        <div className='max-w-4xl mx-auto px-4'>
          <h1 className="text-3xl font-bold mb-4 text-center">Our Leadership Team</h1>
          <p className="text-lg text-gray-700 mb-4">YD’s Leadership Team is comprised of the Office of the Director, a Management Team, and a Committee Chair. We also have an auxiliary branch which acts to provide additional support as needed. Together, our Leadership Team support and empower all members of YD to succeed in their activities.​</p>
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