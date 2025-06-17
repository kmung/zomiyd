// 'use client';

import Image from "next/image";

import HeroCoverImg from "@/public/images/herocover.png";
import ScrollNextSectionBtn from "./ScrollNextSectionBtn";

export default function Hero() {

    return (
        <div className="relative h-screen flex items-center justify-center">
        
        {/* Background Image */}
        <Image
            src={HeroCoverImg}
            alt="Hero Cover"
            className="absolute inset-0 object-cover w-full h-full"
            priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Welcome to Zomi YD</h1>
            <h2 className="text-2xl mb-4">Zomi Picing | Siamsin Picing</h2>
            <button className="bg-pink-secondary text-white px-6 py-3 rounded-lg hover:bg-pink-primary transition-colors">
                <a href="/donate">Donate</a>
            </button>
        </div>

        {/* Scroll Down Button */}
        <ScrollNextSectionBtn targetId="video-section" />
      </div>
    );
}