'use client'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import logo from '../../public/logo.svg'
import Link from 'next/link'
import { List, X } from '@phosphor-icons/react/dist/ssr'
import Signin from './Signin'
import Signup from './Signup'
import Cookies from 'js-cookie'
import { CircleUserRound, LogOut, Settings } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [signIn, setSignIn] = useState(false)
    const [signUp, setSignUp] = useState(false)
    const [token, setToken] = useState(null)
    const [openuser, setOpenuser] = useState(false)
    const [userData, setUserData] = useState(null)
    const pathname = usePathname()
    const userMenuRef = useRef(null)

    useEffect(() => {
        // Get token from cookie
        const cookieToken = Cookies.get('token')
        setToken(cookieToken)

        // Get user data from localStorage
        try {
            const storedUserData = localStorage.getItem('UserData')
            if (storedUserData) {
                setUserData(JSON.parse(storedUserData))
            }
        } catch (error) {
            console.error('Error reading user data:', error)
        }
    }, [])

    useEffect(() => {
       function handleClickOutside(event){
        if(userMenuRef.current && !userMenuRef.current.contains(event.target)){
            setOpenuser(false)
        }
       }
       document.addEventListener('mousedown', handleClickOutside)
       return () => {
        document.removeEventListener('mousedown', handleClickOutside)
       }
    }, [])

    useEffect(() =>{
        setOpen(false)
        setOpenuser(false)
    },[pathname])

    // Define public and protected navigation links
    const publicLinks = [
        { href: "/", text: "الصفحة الرئيسية" },
        { href: "/about", text: "تعرف علينا" },
        { href: "/event", text: "الفعاليات" },
    ]

    const protectedLinks = [
        { href: "/reservations", text: "الحجوزات" },
        { href: "/reports", text: "التقارير" },
        { href: "/information", text: "معلوماتي" },
    ]

    // Combine links based on authentication status
    const navLinks = token ? [...publicLinks, ...protectedLinks] : publicLinks

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('UserData');
        setToken(null);
        setUserData(null);
        router.push('/');
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-[999999]">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/">
                    <Image src={logo} alt="logo" className="w-[150px] h-[100px] md:w-[250px] md:h-[120px] cursor-pointer" priority />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-8">
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-gray-600 hover:text-sky-600 transition-colors"
                        >
                            {link.text}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth Buttons */}
                <div className='hidden lg:flex items-center justify-between space-x-4'>
                    {token ? (
                        <div className='relative' ref={userMenuRef}>
                            <CircleUserRound 
                                size={30} 
                                onClick={() => setOpenuser(!openuser)}
                                className="cursor-pointer text-sky-600 hover:text-teal-800 transition-colors"
                            />
                            {openuser && (
                                <div className='absolute z-50 top-10 left-0 w-[200px] bg-white rounded-lg shadow-lg border border-gray-200'>
                                    <div className='px-4 py-2 border-b border-gray-100'>
                                        <p className='text-sm text-gray-600'>
                                            مرحباً بك{' '}
                                            <span className='text-teal-800 text-md font-semibold'>
                                                {userData ? `${userData.first_name} ${userData.last_name}` : 'زائر'}
                                            </span>
                                        </p>
                                    </div>
                                    
                                    <Link href='/information'>
                                        <div className='px-4 py-2 border-b text-sky-600 hover:bg-sky-600 cursor-pointer rounded-lg hover:text-white transition-colors border-gray-100'>
                                            <p className='text-sm flex flex-row-reverse items-center justify-end gap-2'>
                                                اعدادات الحساب <Settings size={20}/>
                                            </p>
                                        </div>
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full cursor-pointer text-right px-4 py-2 text-sm text-[#DC143C] rounded-lg hover:bg-[#DC143C] hover:text-white transition-colors"
                                    >
                                        <span className="flex flex-row-reverse items-center justify-end gap-2">
                                            تسجيل الخروج <LogOut size={20}/>
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button 
                                onClick={() => setSignUp(true)} 
                                className="cursor-pointer relative border border-gray-300 rounded-lg text-black overflow-hidden hover:text-white transition duration-300 ease-in-out px-6 py-2 group"
                            >
                                <span className="absolute inset-0 bg-sky-600 scale-y-0 origin-top transition-transform duration-300 ease-in-out group-hover:scale-y-100"></span>
                                <span className="relative z-10">انشاء حساب</span>
                            </button>
                            <button 
                                onClick={() => setSignIn(true)} 
                                className="cursor-pointer relative border border-gray-300 rounded-lg text-black overflow-hidden hover:text-white transition duration-300 ease-in-out px-6 py-2 group"
                            >
                                <span className="absolute inset-0 bg-sky-600 scale-y-0 origin-top transition-transform duration-300 ease-in-out group-hover:scale-y-100"></span>
                                <span className="relative z-10">تسجيل الدخول</span>
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setOpen(!open)} className="lg:hidden">
                    <List size={30} />
                </button>

                {/* Mobile Menu */}
                {open && (
                    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center gap-4 p-6 shadow-lg lg:hidden">
                        <button onClick={() => setOpen(false)} className="absolute top-4 right-4">
                            <X size={30} />
                        </button>

                        {/* Mobile Navigation Links */}
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="text-sky-600 font-semibold text-lg"
                            >
                                {link.text}
                            </Link>
                        ))}

                        {/* Mobile Auth Buttons */}
                        {token ? (
                            <div className='w-full flex flex-col gap-3 border-t border-gray-300 pt-4'>
                                <Link href='/information'>
                                    <button 
                                        className="cursor-pointer relative border border-gray-300 rounded-lg text-sky-600 overflow-hidden hover:text-white transition duration-300 ease-in-out px-6 py-2 w-full text-center group"
                                    >
                                        <span className="absolute inset-0 bg-sky-600 scale-y-0 origin-top transition-transform duration-300 ease-in-out group-hover:scale-y-100"></span>
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            اعدادات الحساب <Settings size={20}/>
                                        </span>
                                    </button>
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="cursor-pointer relative border border-gray-300 rounded-lg text-[#DC143C] overflow-hidden hover:text-white transition duration-300 ease-in-out px-6 py-2 w-full text-center group"
                                >
                                    <span className="absolute inset-0 bg-[#DC143C] scale-y-0 origin-top transition-transform duration-300 ease-in-out group-hover:scale-y-100"></span>
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        تسجيل الخروج <LogOut size={20} />
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <button 
                                    onClick={() => {setSignUp(true); setOpen(false)}} 
                                    className="cursor-pointer relative border border-gray-300 rounded-lg text-black overflow-hidden hover:text-white transition duration-300 ease-in-out px-6 py-2 w-full text-center group"
                                >
                                    <span className="absolute inset-0 bg-sky-600 scale-y-0 origin-top transition-transform duration-300 ease-in-out group-hover:scale-y-100"></span>
                                    <span className="relative z-10">انشاء حساب</span>
                                </button>
                                <button 
                                    onClick={() => {setSignIn(true); setOpen(false)}} 
                                    className="cursor-pointer relative border border-gray-300 rounded-lg text-black overflow-hidden hover:text-white transition duration-300 ease-in-out px-6 py-2 w-full text-center group"
                                >
                                    <span className="absolute inset-0 bg-sky-600 scale-y-0 origin-top transition-transform duration-300 ease-in-out group-hover:scale-y-100"></span>
                                    <span className="relative z-10">تسجيل الدخول</span>
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Auth Modals */}
                {signIn && <Signin setSignIn={setSignIn} setSignUp={setSignUp} />}
                {signUp && <Signup setSignUp={setSignUp} />}
            </div>
        </nav>
    )
}
