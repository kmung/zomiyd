'use client';

import HeroCoverImg from "@/public/images/herocover.png";

export default function Hero() {

    const scrollToNextSection = () => {
        document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative z-10 text-white h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${HeroCoverImg.src})`}}>
        <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Welcome to Zomi YD</h1>
            <h2 className="text-2xl mb-4">Zomi Picing | Siamsin Picing</h2>
        </div>
        <button onClick={scrollToNextSection} className="absolute bottom-10 animate-bounce shadow-lg text-white focus:outline-none bg-blue-secondary rounded-full p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </button>
      </div>
    );
}