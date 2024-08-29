import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import React, { useState, useEffect } from 'react'
import { Title, Button, Modal, TextInput, Select, Grid, Switch, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import axios from 'axios'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { useDisclosure } from '@mantine/hooks'

const Index = ({ agencyTypes, locations, routes }) => {
    const [refreshKey, setRefreshKey] = useState(0)
    const [updatedAgents, setUpdatedAgents] = useState([])

    const handleRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1)
        refreshData()
    }

    useEffect(() => {
      refreshData();
    }, [])
    

    const refreshData = () => {
        axios.get('/api/agents')
            .then(response => {
                setUpdatedAgents(response.data)
            })
            .catch(error => {
                console.error('Error fetching agents:', error)
            })
    }

    return (
        <MasterLayout>
            <Head title="Agents" />
            <div className="p-6 shadow-md rounded-lg">
                <div className="flex justify-between items-center my-2">
                    <Title order={2}>Agents</Title>
                    <div className="action">
                        <AddNewAgent
                            agencyTypes={agencyTypes}
                            locations={locations}
                            routes={routes}
                            onSuccess={handleRefresh}
                        />
                    </div>
                </div>
                <div className="my-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {updatedAgents && updatedAgents.map((agent) => (
                                    <tr key={agent.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.agency_type.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <EditAgent
                                                    agent={agent}
                                                    agencyTypes={agencyTypes}
                                                    locations={locations}
                                                    routes={routes}
                                                    onSuccess={handleRefresh}
                                                />
                                                <DeleteAgent agent={agent} onDelete={handleRefresh} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MasterLayout>
    )
}

export default Index

const AddNewAgent = ({ agencyTypes, locations, routes, onSuccess }) => {
    const [opened, setOpened] = useState(false)
    const [filteredRoutes, setFilteredRoutes] = useState(routes)

    const form = useForm({
        initialValues: {
            name: '',
            contact_person: '',
            phone: '',
            fax_no: '',
            email: '',
            postal_code: '',
            address: '',
            parent: '',
            is_latecity: false,
            agency_type_id: '',
            location_id: '',
            route_id: '',
        },
    })

    const handleSubmit = (values) => {
        axios.post('/agency/create', values)
            .then(response => {
                console.log(response.data)
                setOpened(false)
                form.reset()
                onSuccess()
            })
            .catch(error => {
                console.error(error)
                // Handle any errors here
            })
    }

    const handleLocationChange = (value) => {
        form.setFieldValue('location_id', value)
        form.setFieldValue('route_id', '')
        const filtered = routes.filter(route =>
            route.from_location.id.toString() === value || route.to_location.id.toString() === value
        )
        setFilteredRoutes(filtered)
    }

    return (
        <>
            <Button onClick={() => setOpened(true)} >Add New Agent</Button>
            <Modal opened={opened} onClose={() => setOpened(false)} title="Add New Agent" size="xl">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Grid>
                        <Grid.Col span={7}>
                            <TextInput label="Name" {...form.getInputProps('name')} required />
                        </Grid.Col>
                        <Grid.Col span={5}>
                            <Select
                                label="Select Type"
                                data={agencyTypes && agencyTypes.map(type => ({ value: type.id.toString(), label: type.name }))}
                                {...form.getInputProps('agency_type_id')}
                                required
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <TextInput label="Phone" {...form.getInputProps('phone')} />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput label="Email" {...form.getInputProps('email')} type="email" />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput label="Fax No" {...form.getInputProps('fax_no')} />
                        </Grid.Col>

                        <Grid.Col span={9}>
                            <TextInput label="Address" {...form.getInputProps('address')} />
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <TextInput label="Postal Code" {...form.getInputProps('postal_code')} />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <Select
                                label="Location"
                                data={locations && locations.map(location => ({ value: location.id.toString(), label: location.name }))}
                                value={form.values.location_id}
                                onChange={handleLocationChange}
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Select
                                label="Route"
                                data={filteredRoutes && filteredRoutes.map(route => ({ value: route.id.toString(), label: route.name }))}
                                value={form.values.route_id}
                                onChange={(value) => form.setFieldValue('route_id', value)}
                                disabled={!form.values.location_id}
                                required
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <Switch
                                label="Is Late City ?"
                                {...form.getInputProps('is_latecity', { type: 'checkbox' })}
                            />
                        </Grid.Col>
                    </Grid>
                    <Group position="right" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Modal>
        </>
    )
}


const EditAgent = ({ agent, agencyTypes, locations, routes, onSuccess }) => {
    const [opened, setOpened] = useState(false)
    const [filteredRoutes, setFilteredRoutes] = useState(routes)

    const form = useForm({
        initialValues: {
            name: agent.name,
            contact_person: agent.contact_person,
            phone: agent.phone,
            fax_no: agent.fax_no,
            email: agent.email,
            postal_code: agent.postal_code,
            address: agent.address,
            parent: '',
            is_latecity: agent.is_latecity,
            agency_type_id: agent.agency_type_id.toString(),
            location_id: agent.location_id.toString(),
            route_id: agent.route_id.toString(),
        },
    })

    useEffect(() => {
        if (agent.location_id) {
            handleLocationChange(agent.location_id.toString())
        }
    }, [agent.location_id])

    const handleSubmit = (values) => {
        axios.put(`/agency/${agent.id}`, values)
            .then(response => {
                console.log(response.data)
                setOpened(false)
                onSuccess()
            })
            .catch(error => {
                console.error(error)
            })
    }

    const handleLocationChange = (value) => {
        form.setFieldValue('location_id', value)
        form.setFieldValue('route_id', '')
        const filtered = routes.filter(route =>
            route.from_location.id.toString() === value || route.to_location.id.toString() === value
        )
        setFilteredRoutes(filtered)
    }

    return (
        <>
            <button className="text-indigo-600 hover:text-indigo-900 flex items-center" onClick={() => setOpened(true)}>
                <FaEdit className="mr-1" size={14} />
                Edit
            </button>
            <Modal opened={opened} onClose={() => setOpened(false)} title="Edit Agent" size="xl">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Grid>
                        <Grid.Col span={7}>
                            <TextInput label="Name" {...form.getInputProps('name')} required />
                        </Grid.Col>
                        <Grid.Col span={5}>
                            <Select
                                label="Select Type"
                                data={agencyTypes && agencyTypes.map(type => ({ value: type.id.toString(), label: type.name }))}
                                {...form.getInputProps('agency_type_id')}
                                required
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <TextInput label="Phone" {...form.getInputProps('phone')} />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput label="Email" {...form.getInputProps('email')} type="email" />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput label="Fax No" {...form.getInputProps('fax_no')} />
                        </Grid.Col>

                        <Grid.Col span={9}>
                            <TextInput label="Address" {...form.getInputProps('address')} />
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <TextInput label="Postal Code" {...form.getInputProps('postal_code')} />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <Select
                                label="Location"
                                data={locations && locations.map(location => ({ value: location.id.toString(), label: location.name }))}
                                value={form.values.location_id}
                                onChange={handleLocationChange}
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Select
                                label="Route"
                                data={filteredRoutes && filteredRoutes.map(route => ({ value: route.id.toString(), label: route.name }))}
                                value={form.values.route_id}
                                onChange={(value) => form.setFieldValue('route_id', value)}
                                disabled={!form.values.location_id}
                                required
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <Switch
                                label="Is Late City ?"
                                {...form.getInputProps('is_latecity', { type: 'checkbox' })}
                            />
                        </Grid.Col>
                    </Grid>
                    <Group position="right" mt="md">
                        <Button type="submit">Update</Button>
                    </Group>
                </form>
            </Modal>
        </>
    )
}

const DeleteAgent = ({ agent, onDelete }) => {
    const [opened, { open, close }] = useDisclosure(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleDelete = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await axios.delete(`/agency/${agent.id}`)
            if (response.status === 200 || response.status === 204) {
                onDelete()
                close()
            } else {
                setError('Failed to delete the agent. Please try again.')
            }
        } catch (err) {
            setError('An error occurred: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button className="text-red-600 hover:text-red-900 flex items-center" onClick={open}>
                <FaTrash className="mr-1" size={14} />
                Delete
            </button>
            <Modal opened={opened} onClose={close} centered>
                <div className="flex flex-col justify-center items-center">
                    <h2 className="text-center text-3xl text-gray-600 mb-4">
                        Are You Sure?
                    </h2>
                    <p className="mb-4">Do you really want to delete agent: {agent.name}?</p>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <Group>
                        <Button onClick={close} color="gray" disabled={loading}>
                            NO
                        </Button>
                        <Button
                            onClick={handleDelete}
                            color="red"
                            loading={loading}
                            disabled={loading}
                        >
                            YES
                        </Button>
                    </Group>
                </div>
            </Modal>
        </>
    )
}