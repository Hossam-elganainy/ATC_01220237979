'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [reservations, setReservations] = useState([])
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const token = Cookies.get('token')
    
    // Strict token validation
    if (!token || token.length < 10) {
      Cookies.remove('token')
      router.push('/')
      return
    }

    setToken(token)

    const fetchReservations = async() => {
      try {
        const response = await fetch('https://areeb.cowdly.com/en/api/reservations/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          }
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired
            Cookies.remove('token')
            router.push('/')
            return
          }
          throw new Error('Failed to fetch reservations')
        }

        const data = await response.json()
        setReservations(data)
      } catch (error) {
        console.error('Error fetching reservations:', error)
        router.push('/')
      }
    }
    
    fetchReservations()
  }, [router])
  
  return (
    <div className="container mx-auto bg-sky-50 p-8">
      <h1 className="text-3xl font-bold text-sky-900 mb-8">حجوزاتي</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{reservation.title}</h2>
              <p className="text-gray-600">السعر: {reservation.price}</p>
              <p className="text-gray-600">الحالة: {reservation.status}</p>
              <p className="text-gray-600">طريقة الدفع: {reservation.payment_method}</p>
              <p className="text-gray-600">حالة الدفع: {reservation.payment_status}</p>
              <p className="text-gray-600">التاريخ: {formatDate(reservation.date)}</p>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-10 text-gray-500">
            لا توجد حجوزات حالية
          </div>
        )}
      </div>
    </div>
  )
}
