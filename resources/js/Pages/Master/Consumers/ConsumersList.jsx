import { Table, Pagination, ScrollArea, Select, Textarea } from '@mantine/core'; // Updated imports
import React, { useEffect, useState } from 'react'; // Added useState and useEffect
import axios from 'axios'; // Added axios import
import { Button, Modal, TextInput, Group } from '@mantine/core'; // Added Button, Modal, TextInput, Group, FaTrash, MdEdit imports
import { useDisclosure } from '@mantine/hooks'; // Added useDisclosure import
import { MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';


const ConsumersList = (props) => {
    const { items, reload } = props;
    const [activePage, setActivePage] = useState(1); // Added state for pagination
    const [pageSize, setPageSize] = useState(10); // Added state for page size

    useEffect(() => {
        setActivePage(1); // Reset to the first page whenever pageSize changes
    }, [pageSize]);

    const paginatedData = chunk(items, pageSize); // Chunking the items
    const currentPageData = paginatedData[activePage - 1] || []; // Current page data

    const handlePageSizeChange = (value) => {
        setPageSize(Number(value)); // Handle page size change
    };

    const rows = currentPageData.map((item) => ( // Updated rows mapping
        <Table.Tr key={item.id}>
            <Table.Td>{item.name}</Table.Td>
            <Table.Td>{item.consumer_type_id}</Table.Td>
            <Table.Td>{item.location_id}</Table.Td>
            <Table.Td>{item.circulation_route_id}</Table.Td>
            <Table.Td>{item.address}</Table.Td>
            <Table.Td>{item.pin}</Table.Td>
            <Table.Td>{item.phone}</Table.Td>
            <Table.Td>{item.fax}</Table.Td>
            <Table.Td>{item.email}</Table.Td>
            <Table.Td>
                <div className="flex gap-2 justify-end items-center">
                    <EditConsumer item={item} reload={reload} /> {/* Added EditConsumer */}
                    <DeleteConsumer item={item} reload={reload} /> {/* Added DeleteConsumer */}
                </div>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className="my-4 p-4">
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
                                <Table.Th>Consumer Type</Table.Th>
                                <Table.Th>Location</Table.Th>
                                <Table.Th>Circulation Route</Table.Th>
                                <Table.Th>Address</Table.Th>
                                <Table.Th>PIN</Table.Th>
                                <Table.Th>Phone</Table.Th>
                                <Table.Th>Fax</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                    </div>
                ) : (
                    <div>No Consumers found</div>
                )}
            </ScrollArea>
            <Pagination // Added pagination component
                total={paginatedData.length}
                value={activePage}
                onChange={setActivePage}
                mt="sm"
                color="cyan"
                radius="xl"
                withEdges={paginatedData.length > 20}
            />
        </div>
    );
};

export default ConsumersList;
// Helper function to chunk the array
const chunk = (array, size) => {
    return array.reduce((acc, _, index) => {
        if (index % size === 0) {
            acc.push(array.slice(index, index + size));
        }
        return acc;
    }, []);
};
const EditConsumer = ({ item, reload }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [cTypes, setCTypes] = useState([]);
    const [cRoutes, setCRoutes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [formInfo, setFormInfo] = useState({
        name: item.name,
        consumer_type_id: item.consumer_type_id,
        location_id: item.location_id,
        circulation_route_id: item.circulation_route_id,
        address: item.address,
        pin: item.pin,
        phone: item.phone,
        fax: item.fax,
        email: item.email
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`/consumer/update/${item.id}`, formInfo);
            if (response.status === 200) {
                reload();
                close();
            } else {
                setError('Failed to update consumer. Please try again.');
            }
        } catch (error) {
            setError('An error occurred: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCTypes();
        getLocations();
        getCRoutes();
    }, [])

    const getCTypes = () => {
        axios.get(`/api/consumer/types`).then(res => {
            setCTypes(res.data);
        }).catch(err => {
            console.log(err.message);
        })
    }

    const getLocations = () => {
        axios.get(`/api/locations`).then(res => {
            setLocations(res.data);
        }).catch(err => {
            console.log(err.message);
        });
    }

    const getCRoutes = () => {
        axios.get(`/api/c-routes`).then(res => {
            setCRoutes(res.data);
        }).catch(err => {
            console.log(err.message);
        });
    }
    
    return (
        <>
            <Button variant="filled" color="cyan" onClick={open}>
                <MdEdit />
            </Button>
            <Modal opened={opened} onClose={close} title="Edit Consumer" size="xl">
                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-2 my-2">
                        <TextInput
                            label="Consumer Name"
                            value={formInfo.name}
                            onChange={(e) => setFormInfo({ ...formInfo, name: e.target.value })}
                        />
                        <Select
                            label="Consumer Type"
                            placeholder="Select consumer type"
                            className='capitalize'
                            data={cTypes.map(type => ({ value: type.id.toString(), label: type.name }))}
                            value={formInfo.consumer_type_id}
                            onChange={(value) => setFormInfo({ ...formInfo, consumer_type_id: value })}
                        />
                        <Select
                            label="Location"
                            placeholder="Select location"
                            className='capitalize'
                            data={locations.map(loc => ({
                                value: loc.id.toString(),
                                label: `${loc.name} - ${loc.zone ? `(${loc.zone.name})` : ''}`
                            }))}
                            value={formInfo.location_id}
                            onChange={(value) => setFormInfo({ ...formInfo, location_id: value })}
                        />
                        <Select
                            label="Circulation Route"
                            placeholder="Select circulation route"
                            className='capitalize'
                            data={cRoutes.map(route => {
                                const fromLoc = locations.find(loc => loc.id === route.from_location);
                                const toLoc = locations.find(loc => loc.id === route.to_location);
                                let lbl = `${fromLoc ? fromLoc.name : route.from_location} - ${toLoc ? toLoc.name : route.to_location}`;
                                return ({ value: route.id.toString(), label: lbl});
                            })}
                            value={formInfo.circulation_route_id}
                            onChange={(value) => setFormInfo({ ...formInfo, circulation_route_id: value })}
                        />
                        <TextInput
                            label="Phone"
                            placeholder="Enter phone number"
                            value={formInfo.phone}
                            onChange={(e) => setFormInfo({ ...formInfo, phone: e.target.value })}
                        />
                        <TextInput
                            label="Email"
                            placeholder="Enter email"
                            value={formInfo.email}
                            onChange={(e) => setFormInfo({ ...formInfo, email: e.target.value })}
                        />
                        <TextInput
                            label="Fax"
                            placeholder="Enter fax number"
                            value={formInfo.fax}
                            onChange={(e) => setFormInfo({ ...formInfo, fax: e.target.value })}
                        />
                        <TextInput
                            label="PIN"
                            placeholder="Enter PIN"
                            value={formInfo.pin}
                            onChange={(e) => setFormInfo({ ...formInfo, pin: e.target.value })}
                        />
                        <Textarea
                            className='md:col-span-2'
                            label="Address"
                            placeholder="Enter address"
                            value={formInfo.address}
                            onChange={(e) => setFormInfo({ ...formInfo, address: e.target.value })}
                        />
                    </div>
                    <Button type="submit" loading={loading}>Save</Button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </Modal>
        </>
    );
};

const DeleteConsumer = ({ item, reload }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(`/consumer/${item.id}`);
            if (response.status === 200 || response.status === 204) {
                reload();
                close();
            } else {
                setError('Failed to delete the consumer. Please try again.');
            }
        } catch (err) {
            setError('An error occurred: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="filled" color="pink" onClick={open}>
                <FaTrash />
            </Button>
            <Modal opened={opened} onClose={close} centered>
                <div className="flex flex-col justify-center items-center">
                    <h2 className="text-center text-3xl text-gray-600 mb-4">Are You Sure?</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <Group>
                        <Button onClick={close} color="gray" disabled={loading}>NO</Button>
                        <Button onClick={handleDelete} color="pink" loading={loading} disabled={loading}>YES</Button>
                    </Group>
                </div>
            </Modal>
        </>
    );
};