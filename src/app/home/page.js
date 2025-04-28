'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@apollo/client'
import { GET_TODOS, DELETE_TODO, UPDATE_TODO } from '../../graphql/mutations'
import Modal from '../../components/Modal'
import TodoForm from '../../components/TodoForm'

export default function HomePage() {
    const [user, setUser] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTodo, setSelectedTodo] = useState(null)
    const [todos, setTodos] = useState([])
    const [date, setDate] = useState(new Date())
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    // const formattedDate = `${day}/${month}/${year}`
    const weekday = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]
    const dayName = weekday[date.getDay()]
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]
    const monthName = monthNames[month]
    const router = useRouter()

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        } else {
            router.push('/')
        }
    }, [router])

    const { data, loading, error } = useQuery(GET_TODOS, {
        variables: { user_id: user?.id },
        skip: !user?.id,
        context: {
            headers: {
                'x-hasura-role': 'user',
                'x-hasura-user-id': user?.id,
            },
        },
        onCompleted: (data) => {
            setTodos(data?.todos || [])
        },
    })

    const notCompletedTodos = todos.filter((todo) => !todo.is_completed)
    const completedTodos = todos.filter((todo) => todo.is_completed)

    const [deleteTodo, { loading: deleteLoading, error: deleteError }] =
        useMutation(DELETE_TODO)

    const [updateTodo, { loading: updateLoading, error: updateError }] =
        useMutation(UPDATE_TODO)

    const handleAddTodo = (newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo])
    }

    const handleUpdateTodo = (updatedTodo) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === updatedTodo.id ? updatedTodo : todo
            )
        )
    }

    const handleToggleComplete = async (todo) => {
        try {
            const { data } = await updateTodo({
                variables: {
                    id: todo.id,
                    title: todo.title,
                    description: todo.description,
                    priority: todo.priority,
                    is_completed: !todo.is_completed,
                },
            })
            handleUpdateTodo(data.update_todos_by_pk)
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteTodo = async (todoId) => {
        if (confirm('ยืนยันการลบ Todo?')) {
            try {
                await deleteTodo({ variables: { id: todoId } })
                setTodos((prevTodos) =>
                    prevTodos.filter((todo) => todo.id !== todoId)
                )
            } catch (err) {
                console.error(err)
            }
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        router.push('/')
    }

    if (!user) return null

    return (
        <div className='min-h-screen bg-gray-100 flex flex-col items-center p-4'>
            <div className='w-full max-w-2xl'>
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex justify-left items-center mb-6'>
                        <div className='flex justify-between items-center mr-4'>
                            <div className='text-5xl font-bold mr-4'>{day}</div>
                            <div>
                                <p>{dayName}</p>
                                <p>
                                    {monthName} {year}
                                </p>
                            </div>
                            {/* <div></div>
                            <div>{year}</div> */}
                        </div>
                    </div>
                    <div className='flex justify-end items-center mb-4'>
                        <button
                            onClick={() => {
                                setSelectedTodo(null)
                                setIsModalOpen(true)
                            }}
                            className='flex items-center space-x-2 focus:outline-none cursor-pointer'
                        >
                            <span className='w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
                                +
                            </span>
                            <span className='text-lg font-semibold uppercase tracking-wide'>
                                New Task
                            </span>
                        </button>
                    </div>
                </div>
                {/* <div className='border-solid border-black mb-4 w-full'></div> */}
                <div className='text-center m-4 border-t-2 border-dashed pt-4 border-gray-300'>
                    <h2 className='text-3xl'>TODO TASKS</h2>
                </div>
                {loading && <p>กำลังโหลด...</p>}
                {error && (
                    <p className='text-red-500'>ข้อผิดพลาด: {error.message}</p>
                )}
                {/* {deleteError && (
                    <p className='text-red-500'>
                        ข้อผิดพลาด: {deleteError.message}
                    </p>
                )} */}
                {notCompletedTodos.length === 0 && !loading && (
                    <p>ไม่มี Todo</p>
                )}
                <ul className='space-y-2'>
                    {notCompletedTodos.map((todo) => (
                        <li
                            key={todo.id}
                            className={
                                'p-4 rounded-lg shadow' +
                                (todo.priority === 1
                                    ? ' bg-gray-400'
                                    : todo.priority === 2
                                    ? ' bg-blue-400'
                                    : ' bg-orange-600')
                            }
                        >
                            <div
                                className='flex items-center justify-between text-white cursor-pointer'
                                onClick={() => {
                                    setSelectedTodo(todo)
                                    setIsModalOpen(true)
                                }}
                            >
                                <div>
                                    <h1 className='text-bold'>
                                        {todo.priority === 1
                                            ? 'Low'
                                            : todo.priority === 2
                                            ? 'Medium'
                                            : 'High'}
                                    </h1>
                                    <h2
                                        className={
                                            todo.is_completed
                                                ? 'line-through text-gray-500 text-2xl'
                                                : 'text-2xl'
                                        }
                                    >
                                        {todo.title}
                                    </h2>
                                    <span>{todo.description}</span>
                                </div>
                                <div className='flex space-x-2 cursor-pointer'>
                                    {/* <button
                                        onClick={() =>
                                            handleDeleteTodo(todo.id)
                                        }
                                        disabled={deleteLoading}
                                        className='text-red-500 hover:text-red-700 bg-white font-bold py-2 px-4 rounded'
                                    >
                                        ลบ
                                    </button> */}
                                    <input
                                        type='radio'
                                        checked={todo.is_completed}
                                        onChange={() =>
                                            handleToggleComplete(todo)
                                        }
                                        onClick={(e) => e.stopPropagation()} // ป้องกันการคลิก Modal
                                        className='h-5 w-5 text-green-500 focus:ring-green-400'
                                        disabled={updateLoading}
                                    />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className='text-center m-4 border-t-2 border-dashed pt-4 border-gray-300'>
                    <h2 className='text-3xl'>DONE TASKS</h2>
                </div>
                <ul className='space-y-2 mt-4'>
                    {completedTodos.map((todo) => (
                        <li
                            key={todo.id}
                            className={'p-4 rounded-lg shadow bg-green-400'}
                        >
                            <div
                                className='flex items-center justify-between text-white cursor-pointer'
                                onClick={() => {
                                    setSelectedTodo(todo)
                                    setIsModalOpen(true)
                                }}
                            >
                                <div>
                                    <h1 className='text-bold text-white'>
                                        DONE
                                    </h1>
                                    <h2
                                        className={
                                            todo.is_completed
                                                ? 'line-through text-gray-500 text-2xl'
                                                : 'text-2xl'
                                        }
                                    >
                                        {todo.title}
                                    </h2>
                                    <span>{todo.description}</span>
                                </div>
                                <div className='flex space-x-2 items-center'>
                                    <input
                                        type='radio'
                                        checked={todo.is_completed}
                                        onChange={() =>
                                            handleToggleComplete(todo)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        className='h-5 w-5 text-green-500 focus:ring-green-400'
                                        disabled={updateLoading}
                                    />
                                    {/* <button
                                        onClick={() =>
                                            handleDeleteTodo(todo.id)
                                        }
                                        disabled={deleteLoading}
                                        className='text-red-500 hover:text-red-700 bg-white font-bold py-2 px-4 rounded'
                                    >
                                        ลบ
                                    </button> */}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='flex justify-center items-center m-6'>
                <button
                    onClick={handleLogout}
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                >
                    ออกจากระบบ
                </button>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedTodo(null)
                }}
                title={selectedTodo ? 'แก้ไข Todo' : 'เพิ่ม Todo ใหม่'}
            >
                <TodoForm
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedTodo(null)
                    }}
                    userId={user.id}
                    todo={selectedTodo}
                    onAddTodo={handleAddTodo}
                    onUpdateTodo={handleUpdateTodo}
                    onDeleteTodo={handleDeleteTodo}
                />
            </Modal>
        </div>
    )
}
