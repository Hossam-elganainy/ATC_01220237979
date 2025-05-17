'use client'
import React, { useEffect, useState } from 'react'
import Events from '../Components/Events'
import { FaMapMarkerAlt } from "react-icons/fa";
import Link from 'next/link';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';



export default function Page() {
  const [branches, setBranches] = useState([]);
  const [selected, setSelected] = useState("جميع الفروع");
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const response = await fetch("https://areeb.cowdly.com/en/api/branches/");
        const data = await response.json();
        const allBranches = [{ id: 'all', name: 'جميع الفروع' }, ...data];
        setBranches(allBranches);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    }
    fetchBranches();
  }, []);

  return (
    <div>
      <div className='bg-sky-50 w-full h-[40vh] flex flex-col  gap-5 items-center justify-center'>
        <h1 className='text-6xl font-bold text-sky-600'>فعالياتنا</h1>
        <div className='flex items-center justify-center gap-2'>
            <Link href='/' className='text-lg text-gray-500 hover:text-gray-700 transition duration-300 ease-in-out'> الصفحة الرئيسية</Link>
            <MdKeyboardDoubleArrowLeft />
            <h1 className='text-xl text-sky-500 font-bold' >فعالياتنا</h1>

            

        </div>
      </div>
      <div className='flex items-start gap-4 lg:justify-between mt-25 lg:flex-row-reverse flex-col-reverse justify-center w-[90%] mx-auto'>
        <div className='flex-1 '>
          <h1 className='text-2xl w-[90%] mx-auto  font-semibold text-sky-500 mb-5'>يوجد ({count}) فعاليات</h1>
          <Events type='page' onServiceCount={setCount} selectedBranch={selected}  />
          </div>

        {/* Location Dropdown */}
        <div className="relative w-full mb-40 lg:mb-0 lg:w-[300px] my-10 bg-sky-50 px-6 py-2 rounded-2xl pb-5">
          <h1 className='text-2xl text-sky-900 font-bold mb-5'>اختار الفرع</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-sky-400"
          >
            {selected}
            <span className="ml-2">▼</span>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-full bg-[#00203F] scrollbar-thin max-h-[150px] text-white rounded-lg shadow-lg overflow-auto">
              <ul className="max-h-60 ">
                {branches.map((branch) => (
                  <li
                    key={branch.id}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-teal-700 transition border-b border-gray-400"
                    onClick={() => {
                      setSelected(branch.name);
                      setIsOpen(false);
                    }}
                  >
                    <FaMapMarkerAlt />
                    <span>{branch.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
