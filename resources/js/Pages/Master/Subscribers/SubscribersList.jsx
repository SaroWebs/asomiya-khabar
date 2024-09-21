import { Table, Pagination, ScrollArea, Select } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, TextInput, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

const SubscribersList = ({ items, reload }) => {
    const [activePage, setActivePage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setActivePage(1);
    }, [pageSize]);

    const paginatedData = chunk(items, pageSize);
    const currentPageData = paginatedData[activePage - 1] || [];

    const handlePageSizeChange = (value) => {
        setPageSize(Number(value)); // Handle page size change
    };

    const rows = currentPageData.map((item) => (
        <Table.Tr key={item.id}>
            <Table.Td>{item.name}</Table.Td>
            <Table.Td>{item.phone}</Table.Td>
            <Table.Td>{item.email}</Table.Td>
            <Table.Td>
                <EditSubscriber item={item} reload={reload} loading={loading} setLoading={setLoading} />
                <DeleteSubscriber item={item} reload={reload} loading={loading} setLoading={setLoading} />
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className='my-4 p-4'>
            <div className="flex justify-between items-end mb-4">
                <Select
                    label="Show"
                    value={pageSize.toString()}
                    data={['2', '5', '10', '20', '50', '100', '500']}
                    onChange={handlePageSizeChange}
                />
            </div>
            <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                {items.length > 0 ? (
                    <div className='p-4 border rounded-lg'>
                        <Table miw={700} verticalSpacing="md">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Phone</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th className='text-right'>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </div>
                ) : (
                    <div>No Subscribers found</div>
                )}
            </ScrollArea>
            <Pagination total={paginatedData.length} value={activePage} onChange={setActivePage} />
        </div>
    );
};

const chunk = (array, size) => {
    return array.reduce((acc, _, index) => {
        if (index % size === 0) {
            acc.push(array.slice(index, index + size));
        }
        return acc;
    }, []);
};

export default SubscribersList;



const EditSubscriber = (props) => {
    const { setLoading, loading } = props;
    const [opened, { open, close }] = useDisclosure(false);
    const [formInfo, setFormInfo] = useState({
        name: props.item.name,
        phone: props.item.phone,
        email: props.item.email,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        axios.put(`/subscriber/${props.item.id}`, formInfo)
            .then(() => {
                props.reload();
                close();
                setLoading(false);
            })
            .catch(err => {
                console.log(err.message);
                setLoading(false);
            });
    };

    return (
        <>
            <Button variant="filled" color="cyan" onClick={open}>
                <MdEdit />
            </Button>
            <Modal opened={opened} onClose={close} title="Edit Subscriber" size="xl">
                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                    <TextInput label="Name" value={formInfo.name} onChange={(e) => setFormInfo({ ...formInfo, name: e.target.value })} required />
                    <TextInput label="Phone" value={formInfo.phone} onChange={(e) => setFormInfo({ ...formInfo, phone: e.target.value })} />
                    <TextInput label="Email" value={formInfo.email} onChange={(e) => setFormInfo({ ...formInfo, email: e.target.value })} />
                    <Button type="submit" loading={loading}>Save Changes</Button>
                </form>
            </Modal>
        </>
    );
}

const DeleteSubscriber = (props) => {
    const [opened, { open, close }] = useDisclosure(false);
    const { setLoading, loading } = props;

    const handleDelete = () => {
        setLoading(true);
        axios.delete(`/subscriber/${props.item.id}`)
            .then(() => {
                props.reload();
                close();
                setLoading(false);
            })
            .catch(err => {
                console.log(err.message);
                setLoading(false);
            });
    }
    return (
        <>
            <Button variant="filled" color="pink" onClick={open}>
                <FaTrash />
            </Button>
            <Modal opened={opened} onClose={close} centered>
                <div className="flex flex-col justify-center items-center">
                    <h2 className="text-center text-3xl text-gray-600 mb-4">Are You Sure?</h2>
                    <Group>
                        <Button onClick={close} color="gray" disabled={loading}>NO</Button>
                        <Button onClick={handleDelete} color="pink" loading={loading} disabled={loading}>YES</Button>
                    </Group>
                </div>
            </Modal>
        </>
    );
}
