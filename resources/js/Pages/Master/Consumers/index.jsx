import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

const index = (props) => {
    return (
        <MasterLayout {...props}>
            <Head title="Dashboard" />
            <div className="">
                Consumers
            </div>
        </MasterLayout>
    )
}

export default index