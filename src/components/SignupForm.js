'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { SIGNUP_USER } from '../graphql/mutations'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [signup, { loading, error }] = useMutation(SIGNUP_USER, {
        context: {
            headers: {
                'x-hasura-role': 'anonymous',
            },
        },
    })
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await signup({
                variables: { email, password, name },
            })
            if (data.insert_users_one) {
                localStorage.setItem(
                    'user',
                    JSON.stringify(data.insert_users_one)
                )
                router.push('/home')
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className='max-w-md mx-auto mt-10'>
            <form
                onSubmit={handleSubmit}
                className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
            >
                <h2 className='text-2xl mb-6 text-center'>สมัครสมาชิก</h2>
                <div className='mb-4'>
                    <label
                        className='block text-gray-700 text-sm font-bold mb-2'
                        htmlFor='name'
                    >
                        ชื่อ
                    </label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='name'
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                    </button>
                </div>
                {error && (
                    <p className='text-red-500 text-xs italic mt-4'>
                        {error.message}
                    </p>
                )}
            </form>
            <p className='text-center'>
                มีบัญชีแล้ว?{' '}
                <Link href='/' className='text-blue-500 hover:underline'>
                    เข้าสู่ระบบ
                </Link>
            </p>
        </div>
    )
}
