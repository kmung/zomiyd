import coverImage from '@/public/images/img3.jpg';
import volunteerImage from '@/public/images/volunteers.jpg';
import officeImage from '@/public/images/office.jpg';
import Image from 'next/image';
import Cover from '@/components/Cover';

const page: React.FC = () => {
  const programs = [
    { name: 'Youth Leadership Program', description: 'Empowering young leaders through training and mentorship.', image: volunteerImage },
    { name: 'Community Outreach', description: 'Engaging with the community to provide support and resources.', image: volunteerImage },
    { name: 'Educational Workshops', description: 'Offering workshops on various educational topics.', image: volunteerImage },
    { name: 'Health and Wellness', description: 'Promoting health and wellness through various initiatives.', image: volunteerImage },
  ];

  const departments = [
    { name: 'Education Department', description: 'Focuses on educational programs and initiatives.', image: officeImage },
    { name: 'Health Department', description: 'Promotes health and wellness in the community.', image: officeImage },
    { name: 'Community Engagement', description: 'Works to engage and support the community.', image: officeImage },
    { name: 'Leadership Development', description: 'Develops leadership skills in youth.', image: officeImage },
  ];

  return (
    <div id='what-we-do'>
      <Cover backgroundImage={coverImage} title='What We Do' />
      <section className='programs py-8 bg-white'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-6'>Our Programs</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {programs.map((program, index) => (
              <div key={index} className='bg-white shadow-md rounded-md p-4'>
                <Image src={program.image} alt={program.name} />
                <h3 className='text-xl font-bold mt-2'>{program.name}</h3>
                <p className='text-gray-700'>{program.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className='departments py-8 bg-white'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-6'>Our Departments</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {departments.map((department, index) => (
              <div key={index} className='bg-white shadow-md rounded-md p-4'>
                <Image src={department.image} alt={department.name} />
                <h3 className='text-xl font-bold mt-2'>{department.name}</h3>
                <p className='text-gray-700'>{department.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default page