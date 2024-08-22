import { Button, Group, Modal, Pagination, ScrollArea, Select, Table } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import CreateLocation from './CreateLocation';
import SearchLocation from './SearchLocation';
import { useDisclosure } from '@mantine/hooks';
import { MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

const chunk = (array, size) => {
    return array.reduce((acc, _, index) => {
        if (index % size === 0) {
            acc.push(array.slice(index, index + size));
        }
        return acc;
    }, []);
};

const LocationList = ({ items, reload, states }) => {
    const [activePage, setActivePage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setActivePage(1); // Reset to the first page whenever pageSize changes
    }, [pageSize]);

    const paginatedData = chunk(items, pageSize);
    const currentPageData = paginatedData[activePage - 1] || [];

    const handlePageSizeChange = (value) => {
        setPageSize(Number(value));
    };

    const rows = currentPageData.map((row, index) => (
        <Table.Tr key={row.id}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.state?.name}</Table.Td>
            <Table.Td>{row.district?.name}</Table.Td>
            <Table.Td>{row.zone?.name}</Table.Td>
            <Table.Td>
                <div className="flex gap-2 justify-end items-center">
                    <EditLocation item={row} reload={reload} states={states} />
                    <DeleteLocation item={row} reload={reload} />
                </div>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div>
            <h2 className="mb-6 text-3xl font-bold text-slate-400">Locations</h2>
            <div className="flex justify-between items-end mb-4">
                <Select
                    label="Show"
                    value={pageSize.toString()}
                    data={['2', '5', '10', '20', '50', '100', '500']}
                    onChange={handlePageSizeChange}
                />
                <div className="flex items-end gap-4">
                    <SearchLocation {...{ items, reload, states }} />
                    <CreateLocation {...{ reload, states }} />
                </div>
            </div>
            <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                {items.length > 0 ? (
                    <div className='p-4 border rounded-lg'>
                        <Table miw={700} verticalSpacing="md">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Sl. No</Table.Th>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>State</Table.Th>
                                    <Table.Th>District</Table.Th>
                                    <Table.Th>Zone</Table.Th>
                                    <Table.Th></Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                        <div className="flex gap-4 items-center justify-end mt-4">
                            {paginatedData.length > 1 &&
                                <Pagination
                                    total={paginatedData.length}
                                    value={activePage}
                                    onChange={setActivePage}
                                    mt="sm"
                                    color="cyan"
                                    radius="xl"
                                    withEdges={paginatedData.length > 20}
                                />
                            }
                        </div>
                    </div>
                ) : (
                    <div className="flex min-h-60 justify-center items-center">
                        <span className="text-2xl text-slate-300">No Location Found!</span>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default LocationList;


const EditLocation = ({ item, states, reload }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [formInfo, setFormInfo] = useState({
        name: item.name,
        state_id: item.state_id,
        district_id: item.district_id ? item.district_id : '',
        zone_id: item.zone_id ? item.zone_id : '',
    });
    const [dists, setDists] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            console.log(formInfo);

            if (formInfo.state_id) {
                let state_code = states.find(st => st.id === parseInt(formInfo.state_id)).code;
                try {
                    const districtResponse = await axios.get(`/api/districts?state=${state_code}`);
                    const zoneResponse = await axios.get(`/api/zones?state=${state_code}`);
                    setDists(districtResponse.data);
                    setZones(zoneResponse.data);
                } catch (error) {
                    setError('Failed to load districts and zones');
                }
            }
        }
        fetchData();
    }, [formInfo]);

    const handleStateSelect = async (e) => {
        setFormInfo({
            ...formInfo,
            state_id: e.target.value,
            district_id: "",
            zone_id: "",
        });


    };

    const handleDistrictSelect = (e) => {
        setFormInfo({
            ...formInfo,
            district_id: parseInt(e.target.value),
        });
    };

    const handleZoneSelect = (e) => {
        setFormInfo({
            ...formInfo,
            zone_id: parseInt(e.target.value),
        });
    };

    const handleNameChange = (e) => {
        setFormInfo({
            ...formInfo,
            name: e.target.value,
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.put(`/location/update/${item.id}`, formInfo);
            if (response.status === 200) {
                reload();
                close();
            } else {
                setError('Failed to update location. Please try again.');
            }
        } catch (error) {
            setError('An error occurred: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="filled" p={10} color="cyan" onClick={open}>
                <MdEdit />
            </Button>
            <Modal
                opened={opened}
                onClose={close}
                title="Edit Location"
                size="xl"
                centered
            >
                <div className="my-6 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700" htmlFor="state">
                                State:
                            </label>
                            <select
                                className="text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                                id="state"
                                value={formInfo.state_id}
                                onChange={handleStateSelect}
                            >
                                <option value="" disabled>Select State</option>
                                {states.map(st => (
                                    <option key={st.id} value={st.id}>{st.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700" htmlFor="district">
                                District:
                            </label>
                            <select
                                className="text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                                id="district"
                                value={formInfo.district_id ? formInfo.district_id : ''}
                                onChange={handleDistrictSelect}
                            >
                                <option value="" disabled>Select District</option>
                                {dists && dists.map(ds => (
                                    <option key={ds.id} value={ds.id}>{ds.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700" htmlFor="zone">
                                Zone:
                            </label>
                            <select
                                className="text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                                id="zone"
                                value={formInfo.zone_id ? formInfo.zone_id : ''}
                                onChange={handleZoneSelect}
                            >
                                <option value="" disabled>Select Zone</option>
                                {zones && zones.map(zs => (
                                    <option key={zs.id} value={zs.id}>{zs.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="text-xs font-semibold text-gray-700"
                            htmlFor="name"
                        >
                            Location name:
                        </label>
                        <input
                            type="text"
                            className="text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                            id="name"
                            value={formInfo.name}
                            onChange={handleNameChange}
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <div className="flex gap-3 justify-end">
                        <Group>
                            <Button variant="light" onClick={close} disabled={loading}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} loading={loading}>
                                Save
                            </Button>
                        </Group>
                    </div>
                </div>
            </Modal>
        </>
    );
};


const DeleteLocation = ({ item, reload }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.delete(`/location/${item.id}`);

            if (response.status === 200 || response.status === 204) {
                reload();
                close();
            } else {
                setError('Failed to delete the location. Please try again.');
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