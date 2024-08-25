import NewTour from '@/app/components/NewTour'
import React from 'react'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

const NewTourPage = () => {
  const queryClient = new QueryClient()
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewTour />
    </HydrationBoundary>
  )
}

export default NewTourPage