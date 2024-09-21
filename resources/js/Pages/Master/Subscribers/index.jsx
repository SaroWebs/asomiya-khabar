import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MasterLayout from '@/Layouts/MasterLayout';
import SubscribersList from './SubscribersList';
import NewSubscriber from './NewSubscriber';
import axios from 'axios';

const SubscribersIndex = (props) => {
    const [subscribers, setSubscribers] = useState([]);

    const getSubscribers = () => {
        axios.get('/api/subscribers')
            .then(res => setSubscribers(res.data))
            .catch(err => console.log(err.message));
    };

    useEffect(() => {
        getSubscribers();
    }, []);

    return (
        <MasterLayout {...props}>
            <Head title="Subscribers" />
            <div className="p-6">
                <div className="flex justify-between text-center">
                    <h2 className='text-3xl font-semibold text-gray-600'>Subscribers</h2>
                    <NewSubscriber reload={getSubscribers} />
                </div>
                <div className="border p-4 my-4 rounded-md">
                    <SubscribersList items={subscribers} reload={getSubscribers} />
                </div>
            </div>
        </MasterLayout>
    );
};

export default SubscribersIndex;