import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Drawer, Select, Table, Title } from '@mantine/core'
import { MonthPickerInput } from '@mantine/dates'
import '@mantine/dates/styles.css';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs'
import React, { useState, useEffect } from 'react'

const SalesRegister = (props) => {
    const { publications, agents } = props;
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [filters, setFilters] = useState({
        publication: publications.find(pb => pb.active == 1)?.id.toString(),
        month: dayjs().toDate(), // Keep the month as a Date object
    });

    // Helper to generate all days in the selected month
    const getMonthDays = (monthDate) => {
        const startOfMonth = dayjs(monthDate).startOf('month');
        const daysInMonth = startOfMonth.daysInMonth();

        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(startOfMonth.date(i).format('DD')); // Format days as "01", "02", etc.
        }
        return days;
    }

    useEffect(() => {
        if (selectedAgent) {
            open();
        } else {
            close();
        }
    }, [selectedAgent])

    const monthDays = getMonthDays(filters.month);

    return (
        <MasterLayout {...props}>
            <Head title="Sales Register" />
            <div className="relative p-6">
                <div className="flex justify-between items-center my-2">
                    <Title order={2}>Sales Register</Title>
                </div>
                <div className="my-4 relative">
                    <div className="w-full px-4 py-2 min-h-64 p-4 border bg-white border-gray-300 shadow-sm rounded-lg overflow-x-auto">
                        <div className="flex justify-between items-end my-2">
                            <div className="flex items-end gap-4">
                                <div>
                                    <Select
                                        label="Select Publication"
                                        placeholder="Select Publication"
                                        data={publications.map(publication => ({
                                            value: publication.id.toString(),
                                            label: publication.name,
                                        }))}
                                        value={filters.publication}
                                        onChange={(val) => setFilters({ ...filters, publication: val })}
                                    />
                                </div>
                                <div>
                                    <MonthPickerInput
                                        label="Select Month"
                                        placeholder="Pick date"
                                        value={filters.month}
                                        onChange={(val) => setFilters({ ...filters, month: val })}
                                    />
                                </div>
                            </div>
                        </div>
                        {(agents && agents.length > 0) ? (
                            <div>
                                <Table.ScrollContainer minWidth={500} className='min-h-96'>
                                    <Table>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Sl</Table.Th>
                                                <Table.Th className='min-w-[120px]'>Agency</Table.Th>
                                                {monthDays.map((day, index) => (
                                                    <Table.Th className='min-w-[80px]' key={index}>{day}</Table.Th>
                                                ))}
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {agents.map((agent, i) => {
                                                return (
                                                    <Table.Tr
                                                        key={i}
                                                        className='cursor-pointer hover:shadow-md'
                                                        onClick={() => setSelectedAgent(agent)}
                                                    >
                                                        <Table.Td>{i + 1}</Table.Td>
                                                        <Table.Td>{agent.name}</Table.Td>
                                                        {monthDays.map((day, index) => {
                                                            const date = dayjs(filters.month).date(day).format('YYYY-MM-DD');
                                                            const dispatch = agent.dispatches.find(d => d.date == date && d.publication_id == filters.publication); // Check both date and publication

                                                            return (
                                                                <Table.Td key={index}>
                                                                    {dispatch ? (<span className='bg-green-400 w-full block text-center'>{dispatch.free_copies + dispatch.paid_copies + dispatch.returned}</span>) : (<span>-</span>)}
                                                                </Table.Td>
                                                            );
                                                        })}
                                                    </Table.Tr>
                                                )
                                            })}
                                        </Table.Tbody>
                                    </Table>
                                </Table.ScrollContainer>
                                <Drawer
                                    opened={opened}
                                    onClose={() => setSelectedAgent(null)}
                                    title="Sales Statistics"
                                    position='right'
                                    size={'md'}
                                >
                                    {selectedAgent && <AgentDispatchDetails agent={selectedAgent} filters={filters} />}
                                </Drawer>
                            </div>
                        ) : (
                            <div>No Agent</div>
                        )}
                    </div>
                </div>
            </div>
        </MasterLayout>
    )
}

// Function to calculate total copies
const calculateTotalCopies = (dispatches, type) => {
    return dispatches.reduce((total, dispatch) => total + (dispatch[type] || 0), 0);
}

export default SalesRegister;

const AgentDispatchDetails = ({ agent, filters }) => {
    // Filter dispatches for the selected month and publication
    const filteredDispatches = agent.dispatches.filter(dispatch => 
        dayjs(dispatch.date).isSame(filters.month, 'month') && 
        dispatch.publication_id == filters.publication
    );

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{agent.name}</h2>
            <div className="space-y-2">
                <p className="text-gray-700">
                    <span className="font-medium">Total Free Copies:</span> {calculateTotalCopies(filteredDispatches, 'free_copies')}
                </p>
                <p className="text-gray-700">
                    <span className="font-medium">Total Paid Copies:</span> {calculateTotalCopies(filteredDispatches, 'paid_copies')}
                </p>
                <p className="text-gray-700">
                    <span className="font-medium">Total Returned:</span> {calculateTotalCopies(filteredDispatches, 'returned')}
                </p>
                <p className="text-gray-700">
                    <span className="font-medium">Total Packets:</span> {calculateTotalCopies(filteredDispatches, 'packets')}
                </p>
                <p className="text-gray-700">
                    <span className="font-medium">Total Dispatches:</span> {filteredDispatches.length}
                </p>
            </div>
        </div>
    );
}
