'use client'
import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Cookies from 'js-cookie'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { getApiUrl, API_ROUTES, getAuthHeaders } from "../config/api.config";

export default function Booking({ setOpen, event, closed_date }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [time, setTime] = useState('')
  const [payment, setPayment] = useState('cash')
  const [opentime, setOpentime] = useState(false)
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [disabledDates, setDisabledDates] = useState([])

  // Helper function to get only the date part and normalize it
  const getDateOnly = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } catch (e) {
      console.error('Error parsing date:', e);
      return '';
    }
  };

  useEffect(() => {
    const cookieToken = Cookies.get('token')
    setToken(cookieToken || '')
    
    // Fetch existing reservations
    const fetchReservations = async () => {
      try {
        const response = await fetch(getApiUrl(API_ROUTES.RESERVATIONS), {
          method: 'GET',
          headers: getAuthHeaders(cookieToken)
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Event ID from props:', event); // للتحقق من الـ event المرسل
          console.log('Reservations data:', data); // للتحقق من البيانات

          // Convert event to number for comparison
          const serviceId = parseInt(event);
          
          // Extract dates from reservations for this event
          const bookedDates = data
            .filter(reservation => parseInt(reservation.event) === serviceId)
            .map(reservation => getDateOnly(reservation.date));

          console.log('Booked dates for event', serviceId, ':', bookedDates);

          // Add closed dates
          const closedDatesArray = closed_date.split(',')
            .filter(date => date)
            .map(date => getDateOnly(date));
          
          // Combine all dates and remove duplicates
          const allDates = [...new Set([...bookedDates, ...closedDatesArray])];
          console.log('All disabled dates:', allDates);
          
          setDisabledDates(allDates);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    if (cookieToken) {
      fetchReservations();
    }
  }, [event, closed_date])

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setError(null);
  };

  const isDateDisabled = (date) => {
    const dateStr = getDateOnly(date);
    return disabledDates.includes(dateStr);
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return null;

    const [hours, minutes] = time.split(':').map(num => parseInt(num));
    if (isNaN(hours) || isNaN(minutes)) return null;

    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate.toISOString();
  };

  const fetchData = async (e) => {
    e.preventDefault();
    if (!selectedDate || !time || !payment || !event) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedDate = formatDateTime(selectedDate, time);
      if (!formattedDate) {
        setError('تاريخ أو وقت غير صالح');
        setLoading(false);
        return;
      }

      if(payment === 'cash') {
        const response = await fetch(getApiUrl(API_ROUTES.RESERVATIONS), {
          method: 'POST',
          headers: getAuthHeaders(token),
          body: JSON.stringify({
            event: event,
            payment_method: payment
          })
        });

        if (response.ok) {
          setSuccess(true);
          setTimeout(() => {
            setOpen(false);
          }, 2000);
        } else {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.date || 'حدث خطأ أثناء الحجز');
        }
      } else if(payment ==='card'){
        const reponse = await fetch(getApiUrl(API_ROUTES.CARD_PAYMENT), {
          method: 'POST',
          headers: getAuthHeaders(token),
          body:JSON.stringify({
            date:formattedDate,
            service_id:event,
          })
        })
        if(reponse.ok){
          const data = await reponse.json();
          window.location.href = data.payment_url;
          setSuccess(true);
          setTimeout(() => {
            setOpen(false);
          }, 2000);
        } else {
          const errorData = await reponse.json().catch(() => ({}));
          setError(errorData.date || 'حدث خطأ أثناء الدفع');
        }
        
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError(error?.date || 'حدث خطأ أثناء الحجز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]'>
      <div className='bg-white relative md:w-[500px] md:h-[500px] w-[90%] h-[90%] mx-auto p-8 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold mb-4'>حجز خدمة</h2>
        <button
          className='absolute top-4 left-2 cursor-pointer text-gray-600 rounded-full p-2 hover:text-black transition-all duration-300'
          onClick={() => setOpen(false)}
        >
          <X />
        </button>
        {error && <p className='text-red-500 text-center'>{error}</p>}
        <form className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='payment' className='text-sm font-medium text-gray-700'>طريقة الدفع</label>
            <select
              id='payment'
              value={payment || 'cash'}
              onChange={(e) => setPayment(e.target.value)}
              className='mt-1 px-4 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm'
            >
              <option value='cash'>نقدي</option>
              <option value='card' disabled>بطاقة الائتمان (قيد التطوير)</option>
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-700'>التاريخ</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy/MM/dd"
              minDate={new Date()}
              filterDate={date => !isDateDisabled(date)}
              className='mt-1 px-4 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm'
              placeholderText="اختر التاريخ"
            />
            <p className="text-xs text-gray-500">* الأيام المحجوزة غير متاحة للاختيار</p>
          </div>
          <div className='relative flex flex-col gap-2'>
            <label htmlFor='time' className='text-sm font-medium text-gray-700'>الساعة</label>
            <button
              type='button'
              className='bg-gray-100 p-2 w-fit rounded-md hover:bg-gray-200 cursor-pointer flex items-start'
              onClick={(e) => {
                e.preventDefault();
                setOpentime(!opentime);
              }}
            >
              {time || 'اختار الساعة'}
            </button>
            {opentime && (
              <div className='absolute z-10 top-16 flex flex-col gap-2 w-[90%] md:w-[60%] md:h-[150px] overflow-y-auto bg-gray-100 p-4 rounded-md'>
                <div className='grid grid-cols-3 gap-2 text-center'>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('8:00'); setOpentime(false); }}>8:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('9:00'); setOpentime(false); }}>9:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('10:00'); setOpentime(false); }}>10:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('11:00'); setOpentime(false); }}>11:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('12:00'); setOpentime(false); }}>12:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('13:00'); setOpentime(false); }}>13:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('14:00'); setOpentime(false); }}>14:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('15:00'); setOpentime(false); }}>15:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('16:00'); setOpentime(false); }}>16:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('17:00'); setOpentime(false); }}>17:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('18:00'); setOpentime(false); }}>18:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('19:00'); setOpentime(false); }}>19:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('20:00'); setOpentime(false); }}>20:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('21:00'); setOpentime(false); }}>21:00</span>
                  <span className='bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer' onClick={() => { setTime('22:00'); setOpentime(false); }}>22:00</span>
                </div>
              </div>
            )}
          </div>
          {success ? (
            <div className='mt-4 p-3 bg-green-100 text-green-800 rounded-md text-center'>
              تم الحجز بنجاح
            </div>
          ) : (
            <button
              type='button'
              onClick={fetchData}
              className={`mt-4 ${loading || !selectedDate || !time || !payment ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-teal-700'} 
                text-white py-2 px-4 rounded-md transition-colors duration-300 w-full cursor-pointer`}
              disabled={loading}
            >
              {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}