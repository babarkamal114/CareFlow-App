import { Button } from "@/components/ui"
import { Download, Plus } from 'lucide-react'
import React from 'react'
import { AddStaffModal } from './AddStaffModal'

function StaffHeader() {
  return (
    <div className='w-full flex items-center justify-between pb-4 border-b border-cf-border-light'>
        <div className='flex flex-col gap-y-1'>
            <h1 className='font-heading text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-cf-ink'>
                Agency Staff
            </h1>
            <p className='text-sm text-cf-ink-60'>Manage and track agency staff in real-time</p>
        </div>
        <div className='flex items-center gap-x-2'>
            <Button 
            variant='outline'
            >
                <Download className='size-4'/> Export Data
            </Button>
            <AddStaffModal />
        </div>
    </div>
  )
}

export default StaffHeader