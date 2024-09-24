import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Select, Title } from '@mantine/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CreateDispatch from './CreateDispatch'
import DispatchList from './DispatchList'

const index = (props) => {
    const [publications, setPublications] = useState([]);
    const [agents, setAgents] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedPublication, setSelectedPublication]=useState('');

    const getPublications = async () => {
        try {
            const response = await axios.get('/api/publications');
            setPublications(response.data);
        } catch (error) {
            console.error('Error fetching publications:', error);
        } finally {
            console.log('Publications fetched');
        }
    }

    const getAgents = async () => {
        try {
            const response = await axios.get(`/api/agents`);
            setAgents(response.data);
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    }


    useEffect(() => {
        getPublications();
        getAgents();
    }, []);

    useEffect(() => {
        if (selectedPublication) {
            reload();
        }
    }, [selectedPublication]);

    useEffect(() => {
        let active_publication = publications.find(pb => pb.active == 1);
        if (active_publication) {
            setSelectedPublication(active_publication.id.toString());
        }
    }, [publications]);

    const reload = async (search="") => {
        if(!selectedPublication) return;
        try {
            const params = search ? {search: search} : {};
            const response = await axios.get(`/publication/dispatches/${selectedPublication}`, {
                params: params
            });
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            console.log('Items fetched');
        }
    }

    return (
        <MasterLayout {...props}>
            <Head title="Dispatch Entry" />
            <div className="p-6 relative">
                <div className="flex justify-between items-center my-2">
                    <Title order={2}>Dispatch Entry</Title>
                </div>
                <div className="my-4 relative">
                    <div className="w-full min-h-64 p-4 border bg-white  border-gray-300 shadow-sm rounded-lg overflow-x-auto">
                        <div className="flex justify-between items-center my-2">
                            <div className="">
                                <Select
                                    label="Select Publication"
                                    placeholder="Select Publication"
                                    data={publications.map(publication => ({
                                        value: publication.id.toString(), // Convert value to string
                                        label: publication.name,
                                    }))}
                                    value={selectedPublication}
                                    onChange={(val) => setSelectedPublication(val)}
                                />
                            </div>
                            {/* action buttons */}
                            <div className="flex items-center">
                                <CreateDispatch publications={publications} agents={agents} reload={reload} />
                            </div>
                        </div>
                        <hr />

                        <DispatchList
                            publications={publications}
                            agents={agents}
                            reload={reload}
                            items={items}
                        />
                    </div>


                </div>

            </div>
        </MasterLayout>
    )
}

export default index
