'use client'
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { getApiUrl, API_ROUTES, getAuthHeaders } from "../config/api.config";

export default function Reserve({price,status,payment_method,payment_status,date,id}) {
  const token = Cookies.get('token')
  const [message,setMessage] = useState(null)
  const cancelReservation = async()=>{
    try{
      const response = await fetch(getApiUrl(API_ROUTES.CANCEL_RESERVATION(id)), {
        method:'POST',
        headers: getAuthHeaders(token)
      })
      
      const data = await response.json()
      setMessage('تم إلغاء الحجز بنجاح ')
      console.log(data)
    }catch(error){
      console.error('Error:', error)
    }
  }
    return (
      <div className="bg-white w-full  mx-auto rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price Section */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">السعر</p>
          <p className="text-gray-900">{price ? `${price} ر.س` : 'خدمة مجانية'}</p>
        </div>
  
        {/* Status Section */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">الحالة</p>
          <p className="text-gray-900">{status}</p>
        </div>
  
        {/* Payment Method Section */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">طريقة الدفع</p>
          <p className="text-gray-900">{payment_method}</p>
        </div>
  
        {/* Payment Status Section */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">حالة الدفع</p>
          <p className="text-gray-900">{payment_status}</p>
        </div>
  
        {/* Charge ID Section */}
        {/* <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">رقم الشحنة</p>
          <p className="text-gray-900">{chargeId}</p>
        </div> */}
  
        {/* Date Section */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">التاريخ</p>
          <p className="text-gray-900">{date}</p>
        </div>
        <div className="col-span-2 flex justify-center">
          <button onClick={cancelReservation} className='bg-red-600 cursor-pointer hover:bg-red-700 transition-all duration-300 text-white px-4 py-2 rounded-md'>إلغاء الحجز</button>
        </div>
        <div className="col-span-2 flex justify-center">
          {message && <p className='text-green-600'>{message}</p>}
        </div>
  
      </div>
    </div>
    )
  }
