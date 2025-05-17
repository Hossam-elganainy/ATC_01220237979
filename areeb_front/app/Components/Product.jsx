'use client'
import { useState } from "react";
import { MapPin, Star } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Booking from "../Components/Booking";
import Signin from "../Components/Signin";
import Cookies from 'js-cookie';

export default function Product({ name, location, rating, price, image , event,closed_date}) {
  const [open, setOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleBooking = () => {
    const token = Cookies.get('token');
    if (!token) {
      setShowSignIn(true);
      return;
    }
    setOpen(true);
  };

  return (
    <div className="border border-gray-200 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
      {/* ✅ Image Section */}
      <div className="w-full h-[50%]">
        <Image
          src={image}
          alt="product_image"
          width={500}
          height={300}
          className="w-full max-h-[200px] object-cover "
        />
      </div>

      {/* ✅ Content Section */}
      <div className="flex-1 p-5 flex flex-col justify-around">
        {/* Location & Rating */}
        <div className="flex items-center justify-between text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <MapPin size={25} className="text-gray-800" />
            <p className="font-semibold text-sky-900 text-lg">{location}</p>
          </div>
          {/* <p className="flex items-center gap-1">
            {rating !== null && rating > 0 ? `(${rating})` : "لا يوجد تقييم"}
            <Star size={20} weight="fill" className="text-yellow-500" />
          </p> */}
        </div>

        {/* Product Title */}
        <p className="text-xl font-bold text-gray-800 hover:text-sky-900 cursor-pointer transition duration-300">
          {name}
        </p>
      </div>

      {/* ✅ Price & Button Section */}
      <div className="flex items-center justify-between p-5 pt-0">
        {price > 0 ? (
          <p className="text-lg font-semibold text-gray-900">{price} ر.س</p>
        ) : (
          <p className="text-lg font-semibold text-sky-600"> خدمة مجانية</p>
        )}
        <button 
          className="px-6 py-2 cursor-pointer bg-sky-600 text-white text-sm font-medium rounded-md hover:bg-sky-900 transition" 
          onClick={handleBooking}
        >
          احجز الآن
        </button>
        {open && <Booking setOpen={setOpen} event={event || ''} closed_date={closed_date || ''} />}
        {showSignIn && <Signin setSignIn={setShowSignIn} setSignUp={setShowSignUp} />}
      </div>
    </div>
  );
}