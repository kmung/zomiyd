'use client';

interface ScrollNextSectionBtnProps {
    targetId: string;
}

export default function ScrollNextSectionBtn({ targetId } : ScrollNextSectionBtnProps) {
    const scrollToNextSection = () => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <button 
            onClick={scrollToNextSection} 
            className="absolute bottom-10 animate-bounce shadow-lg text-white focus:outline-none bg-blue-secondary rounded-full p-2 z-10"
        >
            <svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 9l-7 7-7-7">
                </path>
            </svg>
        </button>
    );
}