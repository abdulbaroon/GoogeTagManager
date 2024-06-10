"use client"
import { ProtectedRoute } from '@/ProtectedRoute/ProtectedRoute'
import Profile from '@/components/Profile'
import Layout from '@/layout/Layout'
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute>
    <Layout>
      <Profile/>
    </Layout>
    </ProtectedRoute>

  )
}

export default page