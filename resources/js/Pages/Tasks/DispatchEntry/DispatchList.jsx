import { Select, TextInput, Table, Pagination } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import EditEntry from './EditEntry';
import DeleteEntry from './DeleteEntry';

const DispatchList = (props) => {
    const { publications, agents, reload, items } = props;
    const [filterProps, setFilterProps] = useState({
        show: '10',
        search: '',
        page: 1,
    });

    
    useEffect(() => {
        if (filterProps.search) {
            reload(filterProps.search);
        }
    }, [filterProps.search]);


    const itemsPerPage = parseInt(filterProps.show);
    const currentPage = filterProps.page;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const rows = currentItems.map((item, idx) => {
        let sl_number = (filterProps.page - 1) * filterProps.show + (idx + 1);
        return (
            <Table.Tr key={item.id}>
                <Table.Td>
                    <div className="flex gap-2 items-center">
                        <EditEntry item={item} publications={publications} agents={agents}  reload={reload}/>
                        <DeleteEntry item={item} reload={reload}/>
                    </div>
                </Table.Td>
                <Table.Td>
                    {sl_number}
                </Table.Td>
                <Table.Td>{item.agent.name}</Table.Td>
                <Table.Td>{item.date}</Table.Td>
                <Table.Td>{item.free_copies}</Table.Td>
                <Table.Td>{item.paid_copies}</Table.Td>
                <Table.Td>{item.packets}</Table.Td>
                <Table.Td>{item.returned}</Table.Td>
                <Table.Td>{item.bill_id}</Table.Td>
                <Table.Td>{item.billded_copies}</Table.Td>
                <Table.Td>{item.rate}</Table.Td>
                <Table.Td>{item.commission_rate}</Table.Td>
                <Table.Td>{item.credit_notes}</Table.Td>
            </Table.Tr>
        );
    });

    return (
        <div>
            
            <div className="flex justify-between my-2">
                <div className="flex flex-col w-[80px]">
                    <label htmlFor='records' className="mx-2">Show</label>
                    <Select
                        id='records'
                        data={[
                            { value: "10", label: "10" },
                            { value: "20", label: "20" },
                            { value: "30", label: "30" }
                        ]}
                        value={filterProps.show} // Bind the value to filterProps.show
                        onChange={(val) => setFilterProps({ ...filterProps, show: val })} // Update show in filterProps
                    />
                </div>
                <div className="flex items-end">
                    <TextInput
                        placeholder="Search"
                        value={filterProps.search} // Bind the value to filterProps.search
                        onChange={(e) => setFilterProps({ ...filterProps, search: e.target.value })} // Update search in filterProps
                    />
                </div>
            </div>
            <hr />
            <Table.ScrollContainer minWidth={500}>
                <Table className=''>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className='min-w-[150px]'></Table.Th>
                            <Table.Th className='min-w-[80px]'>Sl. No.</Table.Th>
                            <Table.Th className='min-w-[150px]'>Agent</Table.Th>
                            <Table.Th>Date</Table.Th>
                            <Table.Th className='min-w-[100px]'>Free Copies</Table.Th>
                            <Table.Th className='min-w-[100px]'>Paid Copies</Table.Th>
                            <Table.Th className='min-w-[80px]'>Packets</Table.Th>
                            <Table.Th className='min-w-[80px]'>Returned</Table.Th>
                            <Table.Th className='min-w-[100px]'>Bill ID</Table.Th>
                            <Table.Th className='min-w-[120px]'>Billed Copies</Table.Th>
                            <Table.Th>Rate</Table.Th>
                            <Table.Th className='min-w-[140px]'>Commission Rate</Table.Th>
                            <Table.Th className='min-w-[140px]'>Credit Notes</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            <Pagination
                total={Math.ceil(items.length / itemsPerPage)}
                page={currentPage}
                onChange={(page) => setFilterProps({ ...filterProps, page })}
            />
        </div>
    )
}

export default DispatchList

