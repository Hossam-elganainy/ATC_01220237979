'use client'
import React from 'react'
import { X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'
import { getApiUrl, API_ROUTES, DEFAULT_HEADERS } from "../config/api.config";

export default function Signup({setSignUp}) {
  const [error,setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {register,handleSubmit,formState:{errors}, watch} = useForm();
  const router = useRouter();
  
  // Watch password1 for validation
  const password1 = watch('password1');

  const onSubmit = async (data)=>{
    setIsLoading(true);
    setError('');
    
    try{
      // Format the data according to backend requirements
      const formData = {
        first_name: data.first_name,
        last_name: data.last_name,
        id_number: data.id_number,
        password1: data.password1,
        password2: data.password2
      };

      const response = await fetch(getApiUrl(API_ROUTES.REGISTER), {
        method: "POST",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if(response.ok){
        Cookies.set('token', result.token, {expires: 7, secure: true});
        setError('');
        setSignUp(false);
        router.push('/');
        window.location.reload();
        setIsLoading(false);
        localStorage.setItem('UserData', JSON.stringify({
          first_name: data.first_name,
          last_name: data.last_name,
          id_number: data.id_number,
        }));
       
      }else{
        const errorMessages = Object.values(result)
          .flat()
          .join(", ");
        setError(errorMessages);
      }
    } catch(error){
      console.error('Error:', error);
      setError('حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='flex flex-col relative bg-white rounded-lg items-center gap-4 p-6 shadow-lg w-[90%] md:w-[50%] mx-auto'>
        <button type="button" onClick={() => setSignUp(false)} className='absolute cursor-pointer top-4 right-4'>
          <X size={30} />
        </button>
        <h1 className='text-sky-600 font-semibold text-lg'>انشاء حساب</h1>
        
        <input 
          type="text" 
          placeholder='الاسم الاول' 
          className='w-full p-2 rounded-lg border border-gray-300'
          {...register('first_name', { 
            required: 'الاسم الاول مطلوب',
            minLength: {
              value: 2,
              message: 'الاسم الاول يجب ان يكون اطول من حرفين'
            }
          })}
        />
        {errors.first_name && <p className="text-red-400 text-right w-full text-sm">{errors.first_name.message}</p>}

        <input 
          type="text" 
          placeholder='الاسم الثاني' 
          className='w-full p-2 rounded-lg border border-gray-300'
          {...register('last_name', { 
            required: 'الاسم الثاني مطلوب',
            minLength: {
              value: 2,
              message: 'الاسم الثاني يجب ان يكون اطول من حرفين'
            }
          })}
        />
        {errors.last_name && <p className="text-red-400 text-right w-full text-sm">{errors.last_name.message}</p>}

        <input 
          type="number" 
          placeholder='الرقم الوطني' 
          className='w-full p-2 rounded-lg border border-gray-300'
          {...register('id_number', {
            required: 'الرقم الوطني مطلوب',
            pattern: {
              value: /^\d{10}$/,
              message: 'الرقم الوطني غير صالح'
            }
          })}
        />
        {errors.id_number && <p className="text-red-400 text-right w-full text-sm">{errors.id_number.message}</p>}

        <input 
          type="password" 
          placeholder='كلمة المرور' 
          className='w-full p-2 rounded-lg border border-gray-300'
          {...register('password1', {
            required: 'كلمة المرور مطلوبة',
            minLength: {
              value: 8,
              message: 'كلمة المرور يجب ان تكون اطول من 8 حروف'
            }
          })}
        />
        {errors.password1 && <p className="text-red-400 text-right w-full text-sm">{errors.password1.message}</p>}

        <input 
          type="password" 
          placeholder='تاكيد كلمة المرور' 
          className='w-full p-2 rounded-lg border border-gray-300'
          {...register('password2', {
            required: 'تاكيد كلمة المرور مطلوب',
            validate: value => value === password1 || 'كلمات المرور غير متطابقة'
          })}
        />
        {errors.password2 && <p className="text-red-400 text-right w-full text-sm">{errors.password2.message}</p>}

        {error && <p className="text-red-400 text-right w-full text-sm">{error}</p>}
        
        <button 
          type='submit' 
          className='w-full p-2 rounded-lg bg-sky-600 cursor-pointer text-white hover:bg-teal-700 transition-colors'
          disabled={isLoading}
        >
          {isLoading ? 'جاري التسجيل...' : 'انشاء حساب'}
        </button>
      </div>
    </form>
  )
}
