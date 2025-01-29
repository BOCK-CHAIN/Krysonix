import React from 'react'
import { Button } from './ui/button'
import { FaGithub } from 'react-icons/fa'
import Link from 'next/link'
const Navbar = () => {

    return (
        <div className="bg-gray-800 shadow-lg sticky top-0 backdrop-blur-md bg-opacity-50 min-h-[60px] w-full z-50">
            <nav className="container mx-auto px-4">
                <div className='flex justify-between items-center h-[60px]'>
                    <Button asChild className='text-xl '>
                       <Link href='/'>
                           Page Replacement
                        </Link>
                    </Button>
                    <div className='flex items-center space-x-4'>
                        <Link href="https://github.com/nitinbhaskar7/Page-Replacement" target="_blank" rel="noopener noreferrer" className='text-white hover:text-gray-300'>
                            <FaGithub size={24} />
                        </Link>
                    </div>
                </div>
            </nav>
            <div className='h-[0.75px] opacity-50 w-[90%] m-auto bg-white'></div>
        </div>
    )
}

export default Navbar
