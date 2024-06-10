'use client'
import { ProtectedRoute } from '@/ProtectedRoute/ProtectedRoute'
import Team from '@/components/Team'
import Layout from '@/layout/Layout'
import React from 'react'

const page = () => {
  return (
    <>
      <ProtectedRoute>
      <Layout>
        <Team/>
      </Layout>
      </ProtectedRoute>
  </>
  )
}

export default page