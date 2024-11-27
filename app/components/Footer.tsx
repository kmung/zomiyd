import Link from "next/link";

function Footer() {
    return (
        <footer className='bg-blue-primary text-white py-4 flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-2'>
            <p>©2024 
                <Link href='/' className='text-pink-secondary hover:text-pink-primary'> Zomi YD</Link>.&nbsp;All Rights Reserved. Made with <span className='text-red'>&hearts;</span> by
                <a href='https://kmung.github.io/' target='_blank' rel='noreferrer nofollow' className='text-pink-secondary hover:text-pink-primary'>&nbsp;KM</a>&#46;
            </p>
        </footer>
    );
}

export default Footer;