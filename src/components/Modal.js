'use client'

import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white rounded-lg shadow-lg w-full max-w-md mx-4'>
                <div className='flex justify-between items-center p-4 border-b'>
                    <h2 className='text-xl font-semibold'>{title}</h2>
                    <button
                        onClick={onClose}
                        className='text-gray-500 hover:text-gray-700 focus:outline-none'
                    >
                        ✕
                    </button>
                </div>
                <div className='p-4'>{children}</div>
            </div>
        </div>
    )
}
