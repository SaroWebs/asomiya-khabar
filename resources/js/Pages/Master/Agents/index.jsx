import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import React, { useState } from 'react'
import { Title, Button, Table, Group, Modal, TextInput, Select, Grid } from '@mantine/core'
import { useForm } from '@mantine/form'

const Index = ({ agents, agencyTypes, locations, routes }) => {
    const [opened, setOpened] = useState(false)

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
            agency_type_id: '',
            location_id: '',
            route_id: '',
        },
    })

    const handleSubmit = (values) => {
        console.log(values)
        setOpened(false)
    }

    return (
        <MasterLayout>
            <Head title="Agents" />
            <div className="p-6">
                <Group position="apart" mb="md">
                    <Title order={2}>Agents</Title>
                    <Button onClick={() => setOpened(true)}>Add New Agent</Button>
                </Group>

                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact Person</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Agency Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents && agents.map((agent) => (
                            <tr key={agent.id}>
                                <td>{agent.name}</td>
                                <td>{agent.contact_person}</td>
                                <td>{agent.phone}</td>
                                <td>{agent.email}</td>
                                <td>{agent.agency_type.name}</td>
                                <td>
                                    <Group spacing="xs">
                                        <Button variant="outline" size="xs">Edit</Button>
                                        <Button color="red" variant="outline" size="xs">Delete</Button>
                                    </Group>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal opened={opened} onClose={() => setOpened(false)} title="Add New Agent" size="xl">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput label="Name" {...form.getInputProps('name')} required />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput label="Contact Person" {...form.getInputProps('contact_person')} />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput label="Phone" {...form.getInputProps('phone')} />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput label="Fax No" {...form.getInputProps('fax_no')} />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput label="Email" {...form.getInputProps('email')} type="email" />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput label="Postal Code" {...form.getInputProps('postal_code')} />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <TextInput label="Address" {...form.getInputProps('address')} />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label="Parent Agent"
                                    data={agents && agents.map(agent => ({ value: agent.id.toString(), label: agent.name }))}
                                    {...form.getInputProps('parent')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label="Select Type"
                                    data={agencyTypes && agencyTypes.map(type => ({ value: type.id.toString(), label: type.name }))}
                                    {...form.getInputProps('agency_type_id')}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label="Location"
                                    data={locations && locations.map(location => ({ value: location.id.toString(), label: location.name }))}
                                    {...form.getInputProps('location_id')}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label="Route"
                                    data={routes && routes.map(route => ({ value: route.id.toString(), label: route.name }))}
                                    {...form.getInputProps('route_id')}
                                    required
                                />
                            </Grid.Col>
                        </Grid>
                        <Group position="right" mt="md">
                            <Button type="submit">Submit</Button>
                        </Group>
                    </form>
                </Modal>
            </div>
        </MasterLayout>
    )
}

export default Index