'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoNoBg from '@/public/images/yd_logo-nobg.png';

const Header: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerVisible, setHeaderVisible] = useState(true);

    useEffect(() => {
        // Initialize lastScrollY with window.scrollY after component mounts
        setLastScrollY(window.scrollY);

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const screenWidth = window.innerWidth;

            if (currentScrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            if (screenWidth < 768) { // md breakpoint
                if (currentScrollY > lastScrollY && currentScrollY > 20) {
                    setHeaderVisible(false);
                } else {
                    setHeaderVisible(true);
                }
            } else {
                setHeaderVisible(true);
            }

            if (currentScrollY >= 0) { // Ensure lastScrollY is not negative
                setLastScrollY(currentScrollY);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]); // Add lastScrollY to dependency array to ensure it's updated correctly

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className={`w-full fixed top-0 z-20 shadow-lg ${scrolled ? 'bg-blue-secondary bg-opacity-85' : 'bg-blue-secondary bg-opacity-15'} transition-all duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className='flex items-center justify-between px-6 py-3'>
                <div className='bg-white flex items-center p-2 rounded-md shadow-md relative lg:absolute lg:-bottom-24 lg:left-6 transform transition-transform duration-300 hover:scale-105'>
                    <Link href='/'>
                        <Image 
                            id='logo' 
                            src={logoNoBg} 
                            alt='ZYD logo' 
                            width={160}
                            height={160}
                            className= 'h-10 w-10 md:h-20 md:w-24 lg:h-36 lg:w-36 transition-transform duration-300'
                            priority
                        />
                    </Link>
                </div>
                <div className='flex-1 md:hidden text-right'>
                    <button onClick={toggleMenu} className='text-white focus:outline-none'>
                        {menuOpen ? (
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                            </svg>
                        ) : (
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16m-7 6h7'></path>
                            </svg>
                        )}
                    </button>
                </div>
                <nav className={`hidden md:flex space-x-4 ml-auto`}>
                    <Link href='/' className={`px-4 py-2 rounded-md shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 ${scrolled ? 'bg-white text-blue-primary' : 'bg-blue-primary text-white'}`}>Home</Link>
                    <Link href='/about-us' className={`px-4 py-2 rounded-md shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 ${scrolled ? 'bg-white text-blue-primary' : 'bg-blue-primary text-white'}`}>About Us</Link>
                    <Link href='/what-we-do' className={`px-4 py-2 rounded-md shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 ${scrolled ? 'bg-white text-blue-primary' : 'bg-blue-primary text-white'}`}>What We Do</Link>
                    <Link href='/donate' className={`px-4 py-2 rounded-md shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 ${scrolled ? 'bg-pink-secondary text-blue-primary' : 'bg-pink-primary text-white'}`}>Donate</Link>
                </nav>
            </div>
            {menuOpen && (
                <div className='md:hidden bg-blue-primary'>
                    <nav className='flex flex-col space-y-2 p-4 items-center'>
                        <Link href='/' onClick={toggleMenu} className={`px-4 py-2 rounded-md shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 ${scrolled ? 'bg-sky-800 text-white' : 'bg-white text-sky-800'}`}>Home</Link>
                        <Link href='/about-us' onClick={toggleMenu} className={`px-4 py-2 rounded-md shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 ${scrolled ? 'bg-sky-800 text-white' : 'bg-white text-sky-800'}`}>About Us</Link>
                        <Link href='/what-we-do' onClick={toggleMenu} className={`px-4 py-2 rounded-md shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 ${scrolled ? 'bg-sky-800 text-white' : 'bg-white text-sky-800'}`}>What We Do</Link>
                        <Link href='/donate' onClick={toggleMenu} className={`px-4 py-2 rounded-md shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 ${scrolled ? 'bg-pink-secondary text-blue-primary' : 'bg-pink-primary text-white'}`}>Donate</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;