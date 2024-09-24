import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react'
import { Button, TextInput, NumberInput, Select, Drawer } from '@mantine/core'
import { DateInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import axios from 'axios';

const CreateDispatch = (props) => {
    const { publications, agents, reload } = props;
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedDate, setSelectedDate] = useState('')
    const [dispatchForm, setDispatchForm] = useState({
        publication_id: '',
        date: '',
        free_copies: 0,
        paid_copies: 0,
        packets: 0,
        returned: 0,
        bill_id: '',
        billded_copies: 0,
        rate: 0,
        commission_rate: 0,
        credit_notes: '',
        agent_id: '',
    });

    const [selectedPublication, setSelectedPublication] = useState('');

    const handleFormChange = (event) => {
        const { name, value, type, checked } = event.target;
        setDispatchForm((prevForm) => ({
            ...prevForm,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post('/dispatch/store', dispatchForm);
            reload();
            close();
            clearForm();
        } catch (error) {
            console.error('Error creating dispatch entry:', error);
        }
    }

    useEffect(() => {
        if (selectedDate) {
            let dt = new Date(selectedDate);
            dt.setDate(dt.getDate() + 1);
            setDispatchForm((prevForm) => ({
                ...prevForm,
                date: dt.toISOString().split('T')[0],
            }));
        }
    }, [selectedDate]);

    useEffect(() => {
        if (selectedPublication) {
            setDispatchForm((prevForm) => ({
                ...prevForm,
                publication_id: selectedPublication,
            }));
        }
    }, [selectedPublication]);




    const clearForm = () => {
        setDispatchForm({
            date: '',
            free_copies: 0,
            paid_copies: 0,
            packets: 0,
            returned: 0,
            bill_id: '',
            billded_copies: 0,
            rate: 0,
            commission_rate: 0,
            credit_notes: '',
            agent_id: '',
        });
    };

    const handleClose = () => {
        clearForm();
        close();
    };

    return (
        <>
            <Button color="blue" onClick={open}>Create Dispatch Entry</Button>
            <Drawer
                opened={opened}
                onClose={handleClose}
                title="Create Dispatch Entry"
                position='right'
                size={'xl'}
            >

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <Select
                            label="Select Publication"
                            placeholder="Select Publication"
                            data={publications.map(publication => ({
                                value: publication.id.toString(),
                                label: publication.name,
                            }))}
                            value={selectedPublication}
                            onChange={(value) => setSelectedPublication(value)} // Updated
                        />
                        <Select
                            label="Select Agent"
                            placeholder="Select Agent"
                            data={agents && agents.map(agent => ({
                                value: agent.id.toString(),
                                label: agent.name,
                            }))}
                            value={dispatchForm.agent_id}
                            onChange={(value) => handleFormChange({ target: { name: 'agent_id', value } })} // Updated
                        />

                        <DateInput
                            label="Date"
                            placeholder="YYYY-MM-DD"
                            name="date"
                            value={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                        />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        <NumberInput
                            label="Free Copies"
                            placeholder="0"
                            name="free_copies"
                            value={dispatchForm.free_copies}
                            onChange={(value) => handleFormChange({ target: { name: 'free_copies', value } })} // Updated
                        />

                        <NumberInput
                            label="Paid Copies"
                            placeholder="0"
                            name="paid_copies"
                            value={dispatchForm.paid_copies}
                            onChange={(value) => handleFormChange({ target: { name: 'paid_copies', value } })} // Updated
                        />
                        <TextInput
                            className='col-span-2'
                            label="Bill ID"
                            placeholder="Bill ID"
                            name="bill_id"
                            value={dispatchForm.bill_id}
                            onChange={(event) => handleFormChange({ target: { name: 'bill_id', value: event.currentTarget.value } })} // Updated
                        />
                        <NumberInput
                            label="Billed Copies"
                            placeholder="0"
                            name="billded_copies"
                            value={dispatchForm.billded_copies}
                            onChange={(value) => handleFormChange({ target: { name: 'billded_copies', value } })} // Updated
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <NumberInput
                            label="Packets"
                            placeholder="0"
                            name="packets"
                            value={dispatchForm.packets}
                            onChange={(value) => handleFormChange({ target: { name: 'packets', value } })} // Updated
                        />
                        <NumberInput
                            label="Returned"
                            placeholder="0"
                            name="returned"
                            value={dispatchForm.returned}
                            onChange={(value) => handleFormChange({ target: { name: 'returned', value } })} // Updated
                        />

                        <NumberInput
                            label="Rate"
                            placeholder="0"
                            name="rate"
                            value={dispatchForm.rate}
                            onChange={(value) => handleFormChange({ target: { name: 'rate', value } })} // Updated
                        />
                        <NumberInput
                            label="Commission Rate"
                            placeholder="0"
                            name="commission_rate"
                            value={dispatchForm.commission_rate}
                            onChange={(value) => handleFormChange({ target: { name: 'commission_rate', value } })} // Updated
                        />
                    </div>
                    <div className="grid gap-4">
                        <TextInput
                            label="Credit Notes"
                            placeholder="Credit Notes"
                            name="credit_notes"
                            value={dispatchForm.credit_notes}
                            onChange={(event) => handleFormChange({ target: { name: 'credit_notes', value: event.currentTarget.value } })} // Updated
                        />
                    </div>
                    <div className="flex justify-end gap-4 my-4">
                        <Button type="submit" color="blue">Submit</Button>
                        <Button color="red" onClick={handleClose}>Cancel</Button>
                    </div>
                </form>
            </Drawer>
        </>
    );
}

export default CreateDispatch