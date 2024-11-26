interface AvatarCardsProps {
    title: string;
    team: {
        name: string;
        role: string;
        image: string;
    }[];
}

function AvatarCards({ title, team }: AvatarCardsProps) {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
            <div className="flex flex-wrap justify-center">
                {team.map((member, index) => (
                    <div key={index} className='w-full sm:w-1/2 lg:w-1/3 p-4'>
                        <div className='bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105'>
                            <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4"/>
                            <h2 className="text-xl font-bold mb-2">{member.name}</h2>
                            <p className="text-gray-700">{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AvatarCards;