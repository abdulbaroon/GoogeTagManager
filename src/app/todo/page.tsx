"use client"
import TodoForm from '@/components/TodoForm'
import TodoList from '@/components/TodoList'
import dynamic from 'next/dynamic'

import { ProtectedRoute } from '../../ProtectedRoute/ProtectedRoute'
import Layout from '@/layout/Layout'

const todo = () => {

  return (
    <>
      <ProtectedRoute>
        <Layout>
          <TodoForm />
          <TodoList />
        </Layout>
      </ProtectedRoute>
    </>
  )
}
export default dynamic(() => Promise.resolve(todo), { ssr: false })