'use client'
import React, { useState } from 'react'
import { Book, User } from 'lucide-react';
import Personal from '../Components/Personal';
import Booking from '../Components/Booking';
export default function page() {
    const [open, setOpen] = useState('personal')
    
  return (
    <div className = 'w-[90%] mx-auto'>
        <div className = 'flex my-20  justify-between gap-10 flex-wrap'>
            <div className='bg-white w-full h-fit lg:w-1/3 rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
                {/* Header */}
                <div className='bg-gradient-to-r from-teal-50 to-white p-6 border-b border-gray-100'>
                    <h2 className='text-2xl font-bold text-teal-800 mb-2'>لوحة التحكم</h2>
                    <p className='text-gray-600'>إدارة حسابك ومتابعة حجوزاتك</p>
                </div>

                {/* Menu Items */}
                <div className='p-4 space-y-3'>
                    {/* <div onClick={() => setOpen('booking')} className='group hover:bg-sky-50 rounded-xl p-4 transition-all duration-300 cursor-pointer border border-transparent hover:border-teal-100'>
                        <div className='flex items-center justify-between'>
                            <Book className='w-8 h-8 text-sky-600 group-hover:scale-110 transition-transform duration-300' />
                            <div className='text-right'>
                                <h3 className='text-lg font-semibold text-gray-700 group-hover:text-teal-700 transition-colors'>حجوزاتي</h3>
                                <p className='text-sm text-gray-500 group-hover:text-sky-600 transition-colors'>عرض وإدارة حجوزاتك</p>
                            </div>
                        </div>
                    </div> */}

                    <div onClick={() => setOpen('personal')} className='group hover:bg-sky-50 rounded-xl p-4 transition-all duration-300 cursor-pointer border border-transparent hover:border-teal-100'>
                        <div className='flex items-center justify-between'>
                            <User className='w-8 h-8 text-sky-600 group-hover:scale-110 transition-transform duration-300' />
                            <div className='text-right'>
                                <h3 className='text-lg font-semibold text-gray-700 group-hover:text-teal-700 transition-colors'>معلوماتي الشخصية</h3>
                                <p className='text-sm text-gray-500 group-hover:text-sky-600 transition-colors'>تحديث بياناتك الشخصية</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className = 'bg-white h-fit w-full lg:w-3/5 rounded-lg p-2 border shadow-md border-gray-200'>
                {open === 'booking' ? <Booking/> : <Personal/>}
            </div>
        </div>
      
    </div>
  )
}
