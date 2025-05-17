'use client'
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useForm } from "react-hook-form";

export default function Personal() {
  const {register, handleSubmit, formState:{errors}, setValue} = useForm({
    defaultValues: {
      id_number: '',
      old_password: '',
      new_password: '',
      confirm_new_password: ''
    }
  });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    id_number: '',
    
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loadingpassword, setLoadingpassword] = useState(false);

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('UserData'));
      if (userData) {
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          id_number: userData.id_number || ''
        });
        setValue('id_number', userData.id_number || '');
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, []);

  const handlePersonal = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://yanbo3-back.cowdly.com/en/api/users/user_profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${Cookies.get('token')}`
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name
        })
      });

      const data = await response.json();
      if(response.ok){
        setSuccess('تم تحديث البيانات بنجاح');
        localStorage.setItem('UserData', JSON.stringify(formData));
      } else {
        setError(data.message || 'حدث خطأ أثناء تحديث البيانات');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async(data) => {
    try {
        setLoadingpassword(true);
        setPasswordError('');
        setPasswordSuccess('');
        
        const response = await fetch('https://areeb.cowdly.com/en/api/users/password_reset/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${Cookies.get('token')}`
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        console.log(responseData);
        
        if(response.ok){
          setPasswordSuccess('تم تحديث كلمة المرور بنجاح');
        } else {
          if (responseData.non_field_errors && responseData.non_field_errors.length > 0) {
            setPasswordError(responseData.non_field_errors[0]);
          } else {
            setPasswordError(responseData.message || 'حدث خطأ أثناء تحديث كلمة المرور');
          }
        }

    } catch (error) {
        console.error('Error updating password:', error);
        setPasswordError('حدث خطأ في الاتصال بالخادم');
    } finally {
        setLoadingpassword(false);
    }
}

  return (
    <div className='w-full flex flex-col gap-6'>
    <form onSubmit={handlePersonal} className='w-full flex flex-col gap-6 bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 ' >
      {/* First Name Field */}
      <div className="grid md:grid-cols-2 gap-6 w-full">
      <div className="flex flex-col gap-3">
        <label 
          htmlFor="firstName" 
          className="text-lg font-semibold text-sky-900"
        >
          الاسم الأول
        </label>
        <div className="relative">
          <input 
            type="text" 
            id="firstName"
            name="firstName"
            value={formData.first_name}
            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            placeholder="ادخل الاسم الأول" 
            className="w-full p-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     placeholder:text-gray-400 text-gray-700"
          />
        </div>
      </div>

      {/* Last Name Field */}
      <div className="flex flex-col gap-3">
        <label 
          htmlFor="lastName" 
          className="text-lg font-semibold text-sky-900"
        >
          الاسم الثاني
        </label>
        <div className="relative">
          <input 
            type="text" 
            id="lastName"
            name="lastName"
            value={formData.last_name}
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            placeholder="ادخل الاسم الثاني" 
            className="w-full p-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     placeholder:text-gray-400 text-gray-700"
          />
        </div>
      </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="text-red-500 text-right text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-500 text-right text-sm">
          {success}
        </div>
      )}


      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="bg-sky-500 w-full  cursor-pointer text-white p-3 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-sky-950 disabled:cursor-not-allowed"
      >
        {isLoading ? 'جاري التحديث...' : 'تعديل'}
      </button>
    </form>
    {/* password reset */}
    <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-6 bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 '>
        {/* <div className='flex flex-col gap-3'>
            <label htmlFor="email" className='text-lg font-semibold text-sky-900'>البريد الإلكتروني</label>
            <input 
              type="email" 
              id="email" 
              disabled   
              className='w-full p-3 rounded-lg border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       transition-all duration-200 ease-in-out
                       text-gray-400'
              {...register('email')}
            />
        </div> */}
        <div className='flex flex-col gap-3'>
        <label htmlFor="old_password" className='text-lg font-semibold text-sky-900'>كلمة المرور القديمة</label>
        <input type="password" id="old_password" name="old_password"   placeholder='كلمة المرور القديمة' className='w-full p-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     placeholder:text-gray-400 text-gray-700'
                     {...register('old_password', {
                        required: 'كلمة المرور مطلوبة',
                        minLength: {
                            value: 8,
                            message: 'كلمة المرور يجب أن تكون على الأقل 8 أحرف'
                        }
                     })}
                      />
        </div>
        <div className='flex flex-col gap-3'>
            <label htmlFor="new_password" className='text-lg font-semibold text-sky-900'>كلمة المرور الجديدة</label>
            <input type="password" id="new_password" name="new_password"   placeholder='كلمة المرور الجديدة' className='w-full p-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     placeholder:text-gray-400 text-gray-700' 
                     {...register('new_password', {
                        required: 'كلمة المرور مطلوبة',
                        minLength: {
                            value: 8,
                            message: 'كلمة المرور يجب أن تكون على الأقل 8 أحرف'
                        }
                     })} />
        </div>
        <div className='flex flex-col gap-3'>
            <label htmlFor="confirm_password" className='text-lg font-semibold text-sky-900'>تأكيد كلمة المرور</label>
            <input type="password" id="confirm_password" name="confirm_password"   placeholder='تأكيد كلمة المرور' className='w-full p-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     placeholder:text-gray-400 text-gray-700'
                     {...register('confirm_new_password', {
                        required: 'كلمة المرور مطلوبة',
                        minLength: {
                            value: 8,
                            message: 'كلمة المرور يجب أن تكون على الأقل 8 أحرف'
                        }
                     })} />
        </div>
        
        {passwordError && (
          <div className="text-red-500 text-right text-sm">
            {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div className="text-green-500 text-right text-sm">{passwordSuccess}</div>
        )}

        <button type="submit" disabled={loadingpassword} className='bg-sky-500 w-full  cursor-pointer text-white p-3 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-sky-950 disabled:cursor-not-allowed'>
            {loadingpassword ? 'جاري التحديث...' : 'تعديل'}
        </button>
    </form>
    </div>
  )
}
