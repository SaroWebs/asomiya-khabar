import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Select, Title, Switch } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CreateDispatch from './CreateDispatch'
import DispatchList from './DispatchList'
import LabelPrintAll from './LabelPrintAll'
import dayjs from 'dayjs'

const index = (props) => {
    const [publications, setPublications] = useState([]);
    const [agents, setAgents] = useState([]);
    const [items, setItems] = useState([]);

    const today = dayjs().format('YYYY-MM-DD');
    const oneMonthAgo = dayjs().subtract(1, 'month').format('YYYY-MM-DD');

    const [filters, setFilters] = useState({
        publication: '',
        fromDate: oneMonthAgo,
        toDate: today,
        daily: false,
        exactDate: today,
    });

    // Fetch publications
    const getPublications = async () => {
        try {
            const response = await axios.get('/api/publications', {
                params: {
                    publication: filters.publication,
                    fromDate: filters.fromDate,
                    toDate: filters.toDate
                }
            });
            setPublications(response.data);
        } catch (error) {
            console.error('Error fetching publications:', error);
        } finally {
            console.log('Publications fetched');
        }
    };

    // Fetch agents
    const getAgents = async () => {
        try {
            const response = await axios.get(`/api/agents`);
            setAgents(response.data);
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    };

    // Reload dispatch items
    const reload = async (searchText = "") => {
        if (!filters.publication) return;
        try {
            const params = {
                ...(filters.daily && filters.exactDate && { exact_date: filters.exactDate }),
                ...(!filters.daily && searchText && { search: searchText }),
                ...(!filters.daily && filters.fromDate && { from_date: filters.fromDate }),
                ...(!filters.daily && filters.toDate && { to_date: filters.toDate }),
            };
            const response = await axios.get(`/publication/dispatches/${filters.publication}`, {
                params: params
            });
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            console.log('Items fetched');
        }
    };

    useEffect(() => {
        getPublications();
        getAgents();
    }, []);

    useEffect(() => {
        let active_publication = publications.find(pb => pb.active == 1);
        if (active_publication) {
            setFilters((prevFilters) => ({ ...prevFilters, publication: active_publication.id.toString() }));
        }
    }, [publications]);

    // Automatically reload when sufficient filters are selected
    useEffect(() => {
        if (filters.daily) {
            if (filters.publication && filters.exactDate) {
                reload();
            }
        } else {
            if (filters.publication && filters.fromDate && filters.toDate) {
                reload();
            }
        }
    }, [filters.publication, filters.daily, filters.exactDate, filters.fromDate, filters.toDate]);

    const handleDateChange = (date, field) => {
        const utcDate = date ? dayjs(date).utc().format('YYYY-MM-DD') : null;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: utcDate
        }));
    };

    const handleSwitchChange = (event) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            daily: event.currentTarget.checked
        }));
    };

    return (
        <MasterLayout {...props}>
            <Head title="Dispatch Entry" />
            <div className="p-6 relative">
                <div className="flex justify-between items-center my-2">
                    <Title order={2}>Dispatch Entry</Title>
                    <Switch
                        checked={filters.daily}
                        labelPosition="left"
                        label="Daily Dispatch?"
                        onChange={handleSwitchChange}
                    />
                </div>
                <div className="my-4 relative">
                    <div className="w-full px-4 py-2 min-h-64 p-4 border bg-white border-gray-300 shadow-sm rounded-lg overflow-x-auto">
                        <div className="flex justify-between items-end my-2">
                            <div className="flex items-end gap-4">
                                {/* Publication selection */}
                                <div>
                                    <Select
                                        label="Select Publication"
                                        placeholder="Select Publication"
                                        data={publications.map(publication => ({
                                            value: publication.id.toString(),
                                            label: publication.name,
                                        }))}
                                        value={filters.publication}
                                        onChange={(val) => setFilters({ ...filters, publication: val })}
                                    />
                                </div>
                                {filters.daily ? (
                                    <div>
                                        <DateInput
                                            label="Date"
                                            value={filters.exactDate ? new Date(filters.exactDate) : null}
                                            onChange={(date) => handleDateChange(date, 'exactDate')}
                                            placeholder="Date"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <DateInput
                                                label="From Date"
                                                value={filters.fromDate ? new Date(filters.fromDate) : null}
                                                onChange={(date) => handleDateChange(date, 'fromDate')}
                                                placeholder="Pick from date"
                                            />
                                        </div>
                                        <div>
                                            <DateInput
                                                label="To Date"
                                                value={filters.toDate ? new Date(filters.toDate) : null}
                                                onChange={(date) => handleDateChange(date, 'toDate')}
                                                placeholder="Pick to date"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            {/* Action buttons */}
                            <div className="flex items-center gap-4">
                                <LabelPrintAll items={items} />
                                <CreateDispatch publications={publications} agents={agents} reload={reload} />
                            </div>
                        </div>
                        <hr />
                        {/* Dispatch list */}
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
    );
}

export default index;
