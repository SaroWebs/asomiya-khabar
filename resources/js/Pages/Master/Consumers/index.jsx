import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Title } from '@mantine/core'
import React from 'react'
import AddConsumerType from './AddConsumerType'
import NewConsumer from './NewConsumer'
import ConsumersList from './ConsumersList'
import { useState, useEffect } from 'react'

const index = (props) => {
    const [items, setItems] = useState([]);

    const getItems = () => {
        axios.get('/api/consumers')
            .then(res => setItems(res.data))
            .catch(err => console.log(err.message));
    }
    useEffect(() => {
        getItems();
    }, [])

    return (
        <MasterLayout {...props}>
            <Head title="Dashboard" />
            <div className="p-6 relative">
                <div className="flex justify-between items-center my-2">
                    <Title order={2}>Consumers</Title>
                    <div className="action flex gap-2">
                        <AddConsumerType variant='button' className="" />
                        <NewConsumer variant='button' className='' reload={getItems} />
                    </div>
                </div>
                <div className="my-4 relative">
                    <div className="w-full min-h-64 border bg-white  border-gray-300 shadow-sm rounded-lg overflow-x-auto">
                        <ConsumersList items={items} reload={getItems} />
                    </div>
                </div>
            </div>
        </MasterLayout>
    )
}

export default index