'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

// Component that uses useSearchParams wrapped in Suspense
function PaymentStatusContent() {
  const [paymentStatus, setPaymentStatus] = useState(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get parameters directly from URL
  const status = searchParams.get('status')

  useEffect(() => {
    // Only set status to 'paid' if it's exactly 'paid'
    if (status === 'paid') {
      setPaymentStatus('paid')
    } else {
      setPaymentStatus('unpaid')
    }
    setTimeout(() => {
      router.push('reservations')
    }, 5000)
  }, [status, router])

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">حالة الدفع</h1>
      
      {paymentStatus === 'paid' ? (
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="text-green-800 font-semibold text-lg mb-2">تم الدفع بنجاح</p>
          {/* <p className="text-green-700 text-sm">رقم الفاتورة: {invoice_id}</p>
          <p className="text-green-700 text-sm">رقم الطلب: {id}</p> */}
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <p className="text-red-800 font-semibold text-lg mb-2">{status}</p>
          {/* <p className="text-red-700 text-sm">الرسالة: {message || 'حدث خطأ أثناء معالجة الدفع'}</p> */}
        </div>
      )}
      
      <p className="mt-4 text-center text-gray-600">سيتم تحويلك تلقائياً إلى صفحة الحجوزات خلال 5 ثوان...</p>
    </div>
  )
}

// Loading fallback
function PaymentStatusLoading() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">حالة الدفع</h1>
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-gray-800 font-semibold">جاري التحقق من حالة الدفع...</p>
      </div>
    </div>
  )
}

// Main component with Suspense
export default function PaymentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<PaymentStatusLoading />}>
        <PaymentStatusContent />
      </Suspense>
    </div>
  )
}
