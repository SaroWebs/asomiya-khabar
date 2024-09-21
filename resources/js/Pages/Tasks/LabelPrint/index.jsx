import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Title } from '@mantine/core'
import React from 'react'

const index = (props) => {
  return (
    <MasterLayout {...props}>
      <Head title="Label Printing" />
      <div className="p-6 relative">
        <div className="flex justify-between items-center my-2">
          <Title order={2}>Label Printing</Title>
        </div>
        <div className="my-4 relative">
          <div className="w-full min-h-64 border bg-white border-gray-300 shadow-sm rounded-lg overflow-x-auto">
            
          </div>
        </div>
      </div>
    </MasterLayout>
  )
}

export default index