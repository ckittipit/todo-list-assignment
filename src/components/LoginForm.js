'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { LOGIN_USER } from '../graphql/mutations'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const { data, loading, error } = useQuery(LOGIN_USER, {
        variables: { email, password },
        skip: !email || !password,
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('data: ', data)
        if (data?.users?.length > 0) {
            localStorage.setItem('user', JSON.stringify(data.users[0]))
            console.log(localStorage.getItem('user'))
            router.push('/home')
        } else if (data) {
            alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
        }
    }
    return (
        <div className='max-w-md mx-auto mt-10'>
            <form
                onSubmit={handleSubmit}
                className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
            >
                <h2 className='text-2xl mb-6 text-center'>เข้าสู่ระบบ</h2>
                <div className='mb-4'>
                    <label
                        className='block text-gray-700 text-sm font-bold mb-2'
                        htmlFor='email'
                    >
                        อีเมล
                    </label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='email'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='mb-6'>
                    <label
                        className='block text-gray-700 text-sm font-bold mb-2'
                        htmlFor='password'
                    >
                        รหัสผ่าน
                    </label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                        id='password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className='flex items-center justify-center'>
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </div>
                {error && (
                    <p className='text-red-500 text-xs italic mt-4'>
                        {error.message}
                    </p>
                )}
            </form>
            <p className='text-center'>
                ยังไม่มีบัญชี?{' '}
                <Link href='/signup' className='text-blue-500 hover:underline'>
                    สมัครสมาชิก
                </Link>
            </p>
        </div>
    )
}
