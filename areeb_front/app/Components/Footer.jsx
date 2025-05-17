'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { SnapchatLogo, TiktokLogo } from '@phosphor-icons/react/dist/ssr';

export default function Footer() {
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    try {
      async function getBranches() {
        const response = await fetch('https://areeb.cowdly.com/en/api/branches/');
        const data = await response.json();
        setBranches(data);
      }
      getBranches();
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  }, []);

  return (
    <footer className='bg-sky-950 text-white mt-20'>
      {/* Main Footer Content */}
      <div className='w-[90%] mx-auto py-16'>
        <div className='flex flex-wrap justify-between  gap-10'>
          {/* Section 1: Brand & Description */}
          <div className='flex flex-col gap-6'>
            <h1 className='text-4xl font-bold text-sky-400'>قريب</h1>
            <p className='text-gray-300 leading-relaxed'>
              نحن مسئولين عن تاهيل ذوي الاحتياجات الخاصة وما بعد الحوادث وكبار السن
            </p>
            {/* Social Media Links */}
            <div className='flex gap-4 mt-2'>
              <a href="https://www.snapchat.com/add/ta3afiksa?share_id=ST2bOc4PGK8&locale=en-US" target='_blank' className='hover:text-sky-400 transition-colors'>
                <SnapchatLogo className='w-6 h-6' />
              </a>
              <a href="https://www.instagram.com/ta3afiksa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target='_blank' className='hover:text-sky-400 transition-colors'>
                <Instagram className='w-6 h-6' />
              </a>
              <a href="https://www.tiktok.com/@ta3afiksa?is_from_webapp=1&sender_device=pc" target='_blank' className='hover:text-sky-400 transition-colors'>
                <TiktokLogo className='w-6 h-6' />
              </a>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl font-semibold text-sky-400'>روابط سريعة</h2>
            <div className='flex flex-col gap-3'>
              {[
                { href: "/", text: "الصفحة الرئيسية" },
                { href: "/about", text: "من نحن" },
                { href: "/event", text: "الفعاليات" },
                { href: "/reservations", text: "الحجوزات" },
                { href: "/reports", text: "التقارير" }
              ].map((link, index) => (
                <Link 
                  key={index} 
                  href={link.href}
                  className='text-gray-300 hover:text-sky-400 transition-colors flex items-center gap-2 group'
                >
                  <span className='transform group-hover:translate-x-2 transition-transform'>←</span>
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          {/* Section 3: Branches */}
          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl font-semibold text-sky-400'>الفروع</h2>
            <div className='flex flex-col gap-3'>
              {branches.map((branch) => (
                <div key={branch.id} className='flex items-center gap-2 text-gray-300 hover:text-sky-400 transition-colors group cursor-pointer'>
                  <MapPin className='w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform' />
                  <span>{branch.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Contact Information */}
          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl font-semibold text-sky-400'>تواصل معنا</h2>
            <div className='flex flex-col gap-4 text-gray-300'>
              <a href="tel:+9661005553132" className='flex items-center gap-3 hover:text-sky-400 transition-colors group'>
                <Phone className='w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform' />
                <span dir="ltr">+966 100 555 3132</span>
              </a>
              <a href="mailto:info@areeb.sa" className='flex items-center gap-3 hover:text-sky-400 transition-colors group'>
                <Mail className='w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform' />
                <span>info@areeb.sa</span>
              </a>
              {/* Newsletter Subscription */}
              <div className='mt-4'>
                <h3 className='text-sm font-semibold mb-2'>اشترك في النشرة البريدية</h3>
                <form className='flex flex-wrap gap-2' onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder='البريد الإلكتروني' 
                    className='bg-sky-900 text-white rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all'
                  />
                  <button 
                    type="submit"
                    className='bg-sky-300 hover:bg-sky-500 text-teal-950 px-4 py-2 rounded transition-colors hover:shadow-lg'
                  >
                    اشتراك
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className='border-t border-teal-900'>
        <div className='w-[90%] mx-auto py-2 text-center text-gray-400'>
          <p>© {new Date().getFullYear()} قريب. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
