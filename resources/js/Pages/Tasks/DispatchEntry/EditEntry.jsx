import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { Button, TextInput, NumberInput, Select, Drawer, ActionIcon } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import axios from 'axios';
import { RiPencilLine } from 'react-icons/ri';

const EditEntry = (props) => {
    const { item, publications, agents, reload } = props;
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [dispatchForm, setDispatchForm] = useState({
        publication_id: item.publication_id.toString(),
        date: item.date,
        free_copies: item.free_copies || 0,
        paid_copies: item.paid_copies || 0,
        packets: item.packets || 0,
        returned: item.returned || 0,
        bill_id: item.bill_id || '',
        billded_copies: item.billded_copies || 0,
        rate: item.rate || 0,
        commission_rate: item.commission_rate || 0,
        credit_notes: item.credit_notes || '',
        agent_id: item.agent_id.toString(),
    });

    const handleFormChange = (event) => {
        const { name, value, type, checked } = event.target;
        setDispatchForm((prevForm) => ({
            ...prevForm,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`/dispatch/update/${item.id}`, dispatchForm);
            console.log('Dispatch entry updated successfully');
            reload();
            close();
        } catch (error) {
            console.error('Error updating dispatch entry:', error);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            let dt = new Date(selectedDate);
            setDispatchForm((prevForm) => ({
                ...prevForm,
                date: dt.toISOString().split('T')[0],
            }));
        } else if (item.date) {
            let dt = new Date(item.date);
            setSelectedDate(dt);
        }
    }, [selectedDate]);

    return (
        <>
            <ActionIcon variant="filled" color="blue" onClick={open} aria-label="Edit Item">
                <RiPencilLine />
            </ActionIcon>
            <Drawer
                opened={opened}
                onClose={close}
                title="Edit Dispatch Entry"
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
                            value={dispatchForm.publication_id}
                            onChange={(value) => handleFormChange({ target: { name: 'publication_id', value } })} // Updated
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
                            onChange={handleDateChange} // Updated
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
                        <Button type="submit" color="blue">Update</Button>
                        <Button color="red" onClick={close}>Cancel</Button>
                    </div>
                </form>
            </Drawer>
        </>
    );
}

export default EditEntry;