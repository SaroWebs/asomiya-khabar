import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Group, Modal, Select, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaTrash } from 'react-icons/fa';

const RoutesList = () => {
    const [items, setItems] = useState([]);
    const [locations, setLocations] = useState([]);

    const loadLocations = async () => {
        try {
            const response = await axios.get('/api/locations');
            setLocations(response.data);
        } catch (error) {
            console.error('Failed to load routes:', error);
        }
    };

    const loadCRoutes = async () => {
        try {
            const response = await axios.get('/api/c-routes');
            setItems(response.data);
        } catch (error) {
            console.error('Failed to load routes:', error);
        }
    };

    useEffect(() => {
        loadLocations();
        loadCRoutes();
    }, []);

    const rows = items.map((row, index) => {
        const floc = locations.find(location => location.id === row.from_location);
        const tloc = locations.find(location => location.id === row.to_location);

        return (
            <Table.Tr key={row.id}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{floc ? floc.name : row.from_location}</Table.Td>
                <Table.Td>{tloc ? tloc.name : row.to_location}</Table.Td>
                <Table.Td>
                    <DeleteRoute item={row} reload={loadCRoutes} />
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <div>
            <h2 className="mb-6 text-3xl font-bold text-slate-400">Routes</h2>
            <div className="w-full flex items-end justify-end gap-4">
                <CreateRoute reload={loadCRoutes} locations={locations} items={items}/>
            </div>
            <Table miw={700} verticalSpacing="md">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Sl. No</Table.Th>
                        <Table.Th>From</Table.Th>
                        <Table.Th>To</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </div>
    );
};

export default RoutesList;

const CreateRoute = (props) => {
    const { locations, items } = props;
    const [opened, { open, close }] = useDisclosure(false);
    const [formError, setFormError] = useState([]);
    const [formInfo, setFormInfo] = useState({
        from_location: '',
        to_location: '',
    });

    const handleSubmit = async () => {
        setFormError([]); // Clear errors before submission
        if (formInfo.from_location == '' ||  formInfo.to_location == '') {
            setFormError(['From and To locations cannot be empty.']);
            return;
        }
        if (formInfo.from_location === formInfo.to_location) {
            setFormError(['From and To locations cannot be the same.']);
            return;
        }

        const existingRoute = items.find(item => item.from_location == formInfo.from_location && item.to_location == formInfo.to_location);
        if (existingRoute) {
            setFormError(['This route already exists.']);
            return;
        }

        try {
            const response = await axios.post('/c-route/create', formInfo);
            if (response.status === 201) {
                props.reload();
                close();
            } else {
                setFormError(['Failed to create route:', response.statusText]);
            }
        } catch (error) {
            setFormError(['An error occurred:', error]);
        }
    };

    return (
        <>
            <Button variant="filled" p={10} color="cyan" onClick={open}>
                Create Route
            </Button>
            <Modal opened={opened} onClose={close} title="Create Route" centered>
                <div className="my-6 flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-700" htmlFor="from_location">
                            From Location:
                        </label>
                        <Select
                            data={locations.map(loc => ({ value: loc.id.toString(), label: loc.name }))}
                            value={formInfo.from_location}
                            onChange={(value) => setFormInfo({ ...formInfo, from_location: value})}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-700" htmlFor="to_location">
                            To Location:
                        </label>
                        <Select
                            data={locations.map(loc => ({ value: loc.id.toString(), label: loc.name }))}
                            value={formInfo.to_location}
                            onChange={(value) => setFormInfo({ ...formInfo, to_location: value })}
                        />
                    </div>
                    {formError.length > 0 && (
                        <div className="text-red-500 text-sm">
                            {formError.map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-3 justify-end">
                        <Button variant="light" onClick={close}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

const DeleteRoute = ({ item, reload }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.delete(`/c-route/${item.id}`);

            if (response.status === 200 || response.status === 204) {
                reload();
                close();
            } else {
                setError('Failed to delete the route. Please try again.');
            }
        } catch (err) {
            setError('An error occurred: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="filled" p={10} color="pink" onClick={open}>
                <FaTrash />
            </Button>
            <Modal opened={opened} onClose={close} centered>
                <div className="flex flex-col justify-center items-center">
                    <h2 className="text-center text-3xl text-gray-600 mb-4">
                        Are You Sure?
                    </h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <Group>
                        <Button onClick={close} color="gray" disabled={loading}>
                            NO
                        </Button>
                        <Button
                            onClick={handleDelete}
                            color="pink"
                            loading={loading}
                            disabled={loading}
                        >
                            YES
                        </Button>
                    </Group>
                </div>
            </Modal>
        </>
    );
};