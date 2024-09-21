import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { Modal, Button, TextInput } from '@mantine/core';

const NewSubscriber = ({ reload }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [formInfo, setFormInfo] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        let fd = new FormData();
        for (let key in formInfo) {
            fd.append(key, formInfo[key]);
        }
        axios.post('/subscriber/create', fd)
            .then(() => {
                reload();
                close();
            })
            .catch(err => console.log(err.message));
    };

    return (
        <>
            <Button onClick={open}>Add Subscriber</Button>
            <Modal opened={opened} onClose={close} title="Add Subscriber">
                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                    <TextInput label="Name" value={formInfo.name} onChange={(e) => setFormInfo({ ...formInfo, name: e.target.value })} required />
                    <TextInput label="Phone" value={formInfo.phone} onChange={(e) => setFormInfo({ ...formInfo, phone: e.target.value })} />
                    <TextInput label="Email" value={formInfo.email} onChange={(e) => setFormInfo({ ...formInfo, email: e.target.value })} />
                    <TextInput label="Address" value={formInfo.address} onChange={(e) => setFormInfo({ ...formInfo, address: e.target.value })} />
                    <Button type="submit">Add Subscriber</Button>
                </form>
            </Modal>
        </>
    );
};

export default NewSubscriber;
