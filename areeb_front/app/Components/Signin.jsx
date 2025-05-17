'use client'
import { X } from 'lucide-react';
import React, { useEffect } from 'react'
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl, API_ROUTES, getAuthHeaders, DEFAULT_HEADERS } from "../config/api.config";

export default function Signin({setSignIn,setSignUp}) {
    const {register,handleSubmit,formState:{errors}} = useForm();
    const router = useRouter();
    const [error,setError] = useState('');
    const [isLoading,setIsLoading] = useState(false);

    const onSubmit = async(data) => {
        try {
            setIsLoading(true);
            console.log('Attempting login with:', data);
            const response = await fetch(getApiUrl(API_ROUTES.LOGIN), {
                method: 'POST',
                body: JSON.stringify(data),
                headers: DEFAULT_HEADERS
            });
            
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Response data:', result);

            if (response.ok) {
                Cookies.set('token', result.token, {expires: 7, secure: true});
                console.log('Login successful, token saved');
                
                // Get user data after successful login
                await get_user_data();
                
                setSignIn(false);
                router.push('/');
                window.location.reload();
            } else {
                const errorMessages = Object.values(result)
                .flat()
                .join(", ");
                setError(errorMessages);
            }
        } catch(error) {
            console.error('Login error:', error);
            setError('حدث خطأ أثناء تسجيل الدخول');
        } finally {
            setIsLoading(false);
        }
    }

    const get_user_data = async() => {
        try {
            const token = Cookies.get('token');
            if (!token) return;

            const response = await fetch(getApiUrl(API_ROUTES.USER_PROFILE), {
                method: 'GET',
                headers: getAuthHeaders(token)
            });
            const result = await response.json();
            console.log('User profile data:', result);
            
            if(response.ok){
                localStorage.setItem('UserData', JSON.stringify(result));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)} 
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
        >
            <div className='flex flex-col relative bg-white rounded-lg items-center gap-4 p-6 shadow-lg w-[90%] md:w-[50%] mx-auto'>
                <button 
                    type="button"
                    onClick={() => setSignIn(false)} 
                    className='absolute cursor-pointer top-4 right-4 hover:text-gray-600 transition-colors'
                >
                    <X size={30} />
                </button>
                <h1 className='text-sky-600 font-semibold text-lg'>تسجيل الدخول</h1>
                <input 
                    type="email" 
                    placeholder='البريد الإلكتروني' 
                    className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500'
                    {...register('email', {
                        required: 'البريد الإلكتروني مطلوب',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'البريد الإلكتروني غير صالح'
                        }
                    })} 
                />
                {errors.email && <p className="text-red-400 text-right w-full text-sm">{errors.email.message}</p>}

                <input 
                    type="password" 
                    placeholder='كلمة المرور' 
                    className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500'
                    {...register('password', {
                        required: 'كلمة المرور مطلوبة',
                        minLength: {
                            value: 8,
                            message: 'كلمة المرور يجب ان تكون اطول من 8 حروف'
                        }
                    })} 
                />
                {errors.password && <p className="text-red-400 w-full text-right text-sm">{errors.password.message}</p>}
                {error && <p className="text-red-400 w-full text-right text-sm">{error}</p>}
                <button 
                    type='submit' 
                    disabled={isLoading}
                    className='w-full p-2 rounded-lg bg-sky-600 text-white cursor-pointer hover:bg-sky-700 transition-colors disabled:bg-sky-300 disabled:cursor-not-allowed'
                >
                    {isLoading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
                </button>
                
                <p className='text-gray-500'>
                    ليس لديك حساب؟ {' '}
                    <button 
                        type="button"
                        className='text-sky-600 hover:text-sky-700 transition-colors' 
                        onClick={()=>{setSignUp(true);setSignIn(false)}}
                    >
                        انشاء حساب
                    </button>
                </p>
                <button 
                    type="button"
                    className='text-gray-500 hover:text-gray-800 transition-colors'
                >
                    استعادة كلمة المرور
                </button>
            </div>
        </form>
    );
}
