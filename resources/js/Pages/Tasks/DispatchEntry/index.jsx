import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Button, Title, Select, Modal, TextInput, Checkbox, NumberInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const index = (props) => {
    const [items, setItems] = useState([]);
    const [publications, setPublications] = useState([]);
    const [selectedPublication, setSelectedPublication] = useState('');
    const [dispatchForm, setDispatchForm] = useState({
        date: '',
        free: false,
        paid: false,
        membership: '',
        subscription: '',
        packets: 0,
        returned: 0,
        billid: '',
        rate: 0,
        commission_rate: 0,
        billded_copies: 0,
        credit_notes: '',
    });

    const getItems = async () => {
        try {
            const response = await axios.get(`/task-data/dispatches?publication_id=${selectedPublication}`);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            console.log('Items fetched');
        }
    }

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

    const handleSubmit = async () => {
        try {
            await axios.post('/dispatch/create', dispatchForm);
            console.log('Dispatch entry created successfully');
        } catch (error) {
            console.error('Error creating dispatch entry:', error);
        }
    }

    useEffect(() => {
        if (selectedPublication) {
            getItems();
        }
    }, [selectedPublication]);

    useEffect(() => {
        getPublications();
    }, []);

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
                                    onChange={setSelectedPublication}
                                />
                            </div>
                            {/* action buttons */}
                            <div className="flex items-center">
                                <CreateDispatch onFormSubmit={handleSubmit} />
                            </div>
                        </div>
                        <hr />
                        {/* justify end (show record, search, filter) */}
                        <div className="flex justify-between my-2">
                            <div className="flex items-end">
                                <div className="flex flex-col">
                                    <label htmlFor='records' className="mx-2">Show</label>
                                    <select id='records' className="form-select">
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                    </select>
                                </div>
                                <input type="text" className="form-input" placeholder="Search" />
                            </div>
                        </div>
                        <hr />
                        {/* table */}
                    </div>


                </div>

            </div>
        </MasterLayout>
    )
}

export default index

const CreateDispatch = ({ onFormSubmit }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [dispatchForm, setDispatchForm] = useState({
        date: '',
        free: false,
        paid: false,
        membership: '',
        subscription: '',
        packets: 0,
        returned: 0,
        billid: '',
        rate: 0,
        commission_rate: 0,
        billded_copies: 0,
        credit_notes: '',
    });

    const handleFormChange = (event) => {
        const { name, value, type, checked } = event.target;
        setDispatchForm((prevForm) => ({
            ...prevForm,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <>
            <Button color="blue" onClick={open}>Create Dispatch Entry</Button>
            <Modal
                opened={opened}
                onClose={close}
                title="Create Dispatch Entry"
            >
                <form onSubmit={() => onFormSubmit(dispatchForm)} className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <TextInput
                            label="Date"
                            placeholder="YYYY-MM-DD"
                            name="date"
                            value={dispatchForm.date}
                            onChange={handleFormChange}
                        />
                        <Checkbox
                            label="Free"
                            name="free"
                            checked={dispatchForm.free}
                            onChange={handleFormChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Checkbox
                            label="Paid"
                            name="paid"
                            checked={dispatchForm.paid}
                            onChange={handleFormChange}
                        />
                        <TextInput
                            label="Membership"
                            placeholder="Membership"
                            name="membership"
                            value={dispatchForm.membership}
                            onChange={handleFormChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TextInput
                            label="Subscription"
                            placeholder="Subscription"
                            name="subscription"
                            value={dispatchForm.subscription}
                            onChange={handleFormChange}
                        />
                        <NumberInput
                            label="Packets"
                            placeholder="0"
                            name="packets"
                            value={dispatchForm.packets}
                            onChange={handleFormChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput
                            label="Returned"
                            placeholder="0"
                            name="returned"
                            value={dispatchForm.returned}
                            onChange={handleFormChange}
                        />
                        <TextInput
                            label="Bill ID"
                            placeholder="Bill ID"
                            name="billid"
                            value={dispatchForm.billid}
                            onChange={handleFormChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput
                            label="Rate"
                            placeholder="0"
                            name="rate"
                            value={dispatchForm.rate}
                            onChange={handleFormChange}
                        />
                        <NumberInput
                            label="Commission Rate"
                            placeholder="0"
                            name="commission_rate"
                            value={dispatchForm.commission_rate}
                            onChange={handleFormChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput
                            label="Billed Copies"
                            placeholder="0"
                            name="billded_copies"
                            value={dispatchForm.billded_copies}
                            onChange={handleFormChange}
                        />
                        <TextInput
                            label="Credit Notes"
                            placeholder="Credit Notes"
                            name="credit_notes"
                            value={dispatchForm.credit_notes}
                            onChange={handleFormChange}
                        />
                    </div>
                    <Button type="submit" color="blue" className="mt-4">Submit</Button>
                </form>
            </Modal>
        </>
    );
}