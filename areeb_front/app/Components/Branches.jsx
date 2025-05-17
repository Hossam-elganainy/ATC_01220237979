"use client";

import dynamic from "next/dynamic";

// Dynamically import the component with SSR disabled
const LeafletMap = dynamic(() => import("./Leaflet"), {
  ssr: false,
});

export default function Branches() {
  return (
    <div className='w-[90%] mx-auto my-10 mt-20 mb-40'>
        <div className='flex items-center flex-col gap-6 md:flex-row justify-center md:justify-between mb-10'>
            <h1 className='text-sky-600 font-bold text-6xl'>فروعنا</h1>
        </div>
        <div className='min-w-full h-[50vh] relative mb-20'>
          <LeafletMap/>
        </div>
    </div>
  )
}
