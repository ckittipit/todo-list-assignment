'use client'

import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_TODO, UPDATE_TODO } from '../graphql/mutations'

export default function TodoForm({
    isOpen,
    onClose,
    userId,
    todo,
    onAddTodo,
    onUpdateTodo,
    onDeleteTodo,
}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState(1)
    const [isCompleted, setIsCompleted] = useState(false)
    const [addTodo, { loading: addLoading, error: addError }] =
        useMutation(ADD_TODO)
    const [updateTodo, { loading: updateLoading, error: updateError }] =
        useMutation(UPDATE_TODO)

    useEffect(() => {
        if (todo) {
            setTitle(todo.title)
            setDescription(todo.description)
            setPriority(todo.priority)
            setIsCompleted(todo.is_completed)
        } else {
            setTitle('')
            setIsCompleted(false)
        }
    }, [todo])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (todo) {
                // Update Todo
                const { data } = await updateTodo({
                    variables: {
                        id: todo.id,
                        title,
                        description,
                        priority,
                        is_completed: isCompleted,
                    },
                })
                onUpdateTodo(data.update_todos_by_pk)
            } else {
                // Add Todo
                const { data } = await addTodo({
                    variables: {
                        title,
                        description,
                        priority,
                        is_completed: isCompleted,
                        user_id: userId,
                    },
                })
                onAddTodo(data.insert_todos_one)
            }
            onClose()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = () => {
        if (todo) {
            onDeleteTodo(todo.id) // เรียก callback เพื่อลบ Todo
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <form onSubmit={handleSubmit} className='p-4'>
            <div className='mb-4'>
                <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='title'
                >
                    ชื่อ Todo
                </label>
                <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='title'
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className='mb-4'>
                <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='title'
                >
                    Description
                </label>
                <textarea
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='description'
                    type='text'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                    ความสำคัญ
                </label>
                <select
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value='1'>Low</option>
                    <option value='2'>Medium</option>
                    <option value='3'>High</option>
                </select>
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                    สถานะ
                </label>
                <input
                    type='checkbox'
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                    className='mr-2 leading-tight'
                />
                <span>สำเร็จ</span>
            </div>
            {(addError || updateError) && (
                <p className='text-red-500 text-xs italic mb-4'>
                    {addError?.message || updateError?.message}
                </p>
            )}
            <div className='flex justify-between mt-4'>
                {todo && (
                    <button
                        type='button'
                        onClick={handleDelete}
                        className='bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded'
                    >
                        ลบ Todo
                    </button>
                )}
                <button
                    type='button'
                    onClick={onClose}
                    className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2'
                >
                    ยกเลิก
                </button>
                <button
                    type='submit'
                    disabled={addLoading || updateLoading}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded'
                >
                    {addLoading || updateLoading
                        ? 'กำลังบันทึก...'
                        : todo
                        ? 'อัปเดต'
                        : 'เพิ่ม'}
                </button>
            </div>
        </form>
    )
}
