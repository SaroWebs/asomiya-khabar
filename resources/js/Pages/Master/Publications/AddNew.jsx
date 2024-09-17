import React from 'react';
import { Button, Modal, TextInput, NumberInput, Checkbox, Select, Group, Grid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';

export function AddNewPublication(props) {
    const {publications, reload} = props;
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            name: '',
            code: '',
            frequency: 1,
            parent_id: '',  // Change this to an empty string
            supplement: 0,
            rni_no: '',
            davp_code: '',
            late_city: 0,
            mr_code: '',
            daily_rate: null,
            active: 0,
        },
        validate: {
            name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
            frequency: (value) => (value > 0 ? null : 'Frequency must be greater than 0'),
        },
    });

    const handleSubmit = async (values) => {
        try {
            const formattedValues = {
                ...values,
                supplement: values.supplement ? 1 : 0,
                late_city: values.late_city ? 1 : 0,
                active: values.active ? 1 : 0,
            };
            await axios.post('/publication/create', formattedValues);
            close();
            form.reset();
            reload();
        } catch (error) {
            console.error('Error adding publication:', error);
        }
    };

    const filterParentOptions = () => {
        if (!publications || !Array.isArray(publications)) return [];
        return publications.map(pub => ({ value: pub.id.toString(), label: pub.name }));
    };

    return (
        <>
            <Button onClick={open}>Create</Button>

            <Modal
                opened={opened}
                onClose={close}
                title="Add New Publication"
                size="lg"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Grid gutter="md">
                        <Grid.Col span={6}>
                            <TextInput
                                label="Name"
                                placeholder="Enter publication name"
                                {...form.getInputProps('name')}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Code"
                                placeholder="Enter publication code"
                                {...form.getInputProps('code')}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <NumberInput
                                label="Frequency"
                                placeholder="Enter frequency"
                                min={1}
                                {...form.getInputProps('frequency')}
                            />
                        </Grid.Col>
                        <Grid.Col span={8}>
                            <Select
                                label="Parent Publication"
                                placeholder="Select parent publication"
                                data={filterParentOptions()}
                                clearable
                                {...form.getInputProps('parent_id')}
                                onChange={(value) => form.setFieldValue('parent_id', value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="RNI No"
                                placeholder="Enter RNI number"
                                {...form.getInputProps('rni_no')}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="DAVP Code"
                                placeholder="Enter DAVP code"
                                {...form.getInputProps('davp_code')}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="MR Code"
                                placeholder="Enter MR code"
                                {...form.getInputProps('mr_code')}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <NumberInput
                                label="Daily Rate"
                                placeholder="Enter daily rate"
                                precision={2}
                                min={0}
                                {...form.getInputProps('daily_rate')}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Checkbox
                                label="Supplement"
                                checked={form.values.supplement === 1}
                                onChange={(event) => form.setFieldValue('supplement', event.currentTarget.checked ? 1 : 0)}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Checkbox
                                label="Late City"
                                checked={form.values.late_city === 1}
                                onChange={(event) => form.setFieldValue('late_city', event.currentTarget.checked ? 1 : 0)}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Checkbox
                                label="Active"
                                checked={form.values.active === 1}
                                onChange={(event) => form.setFieldValue('active', event.currentTarget.checked ? 1 : 0)}
                            />
                        </Grid.Col>
                    </Grid>
                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Modal>
        </>
    );
}