import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Switch } from '@mantine/core';

const Editions = ({ publications }) => {
    const [selectedPublication, setSelectedPublication] = useState(null);
    const [editions, setEditions] = useState([]);
    const [isAddingEdition, setIsAddingEdition] = useState(false);

    useEffect(() => {
        if (selectedPublication) {
            loadEditions();
        }
    }, [selectedPublication]);

    const loadEditions = async () => {
        try {
            const response = await axios.get(`/api/publication/${selectedPublication}/editions`);
            setEditions(response.data);
        } catch (error) {
            console.error('Error loading editions:', error);
        }
    };

    const handlePublicationChange = (e) => {
        setSelectedPublication(e.target.value);
    };

    const handleAddEdition = async (newEditionData) => {
        try {
            const response = await axios.post(`/edition/${selectedPublication}/create`, newEditionData);
            if (response.status === 201) {
                setIsAddingEdition(false);
                loadEditions();
            } else {
                throw new Error('Failed to add edition');
            }
        } catch (error) {
            console.error('Error adding edition:', error.message);
        }
    };

    const handleRemoveEdition = async (editionId) => {
        try {
            await axios.delete(`/api/editions/${editionId}`);
            loadEditions();
        } catch (error) {
            console.error('Error removing edition:', error);
        }
    };

    const handleStatusChange = async (editionId, newStatus) => {
        if(newStatus){
            try {
                await axios.patch(`/edition/${editionId}/update-status`, { active: newStatus });
                loadEditions();
            } catch (error) {
                console.error('Error updating edition status:', error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <select
                    value={selectedPublication || ''}
                    onChange={handlePublicationChange}
                    className="mb-4 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select a publication</option>
                    {publications.map((pub) => (
                        <option key={pub.id} value={pub.id}>{pub.name}</option>
                    ))}
                </select>
                {selectedPublication && (
                    <div className="">
                        <Button onClick={() => setIsAddingEdition(true)} color="blue">
                            Add New Edition
                        </Button>
                    </div>
                )}
            </div>

            {selectedPublication && (
                <>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Prefix</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt Prefix</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Prefix</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DN Prefix</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CN Prefix</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {editions.map((edition) => (
                                <tr key={edition.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{edition.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{edition.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{edition.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{edition.bill_prefix}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{edition.receipt_prefix}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{edition.pay_prefix}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{edition.dn_prefix}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{edition.cn_prefix}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2 items-center">
                                            <Switch
                                                checked={edition.active === 1}
                                                onChange={(event) => handleStatusChange(edition.id, event.currentTarget.checked ? 1 : 0)}
                                                color="green"
                                            />
                                            <Button
                                                onClick={() => handleRemoveEdition(edition.id)}
                                                color="red"
                                                variant="subtle"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            <Modal
                opened={isAddingEdition}
                onClose={() => setIsAddingEdition(false)}
                title="Add New Edition"
                size={"lg"}
            >
                <AddNewEdition onSubmit={handleAddEdition} onCancel={() => setIsAddingEdition(false)} />
            </Modal>
        </div>
    );
};

export default Editions;

const AddNewEdition = ({ onSubmit, onCancel }) => {
    const [newEdition, setNewEdition] = useState({
        name: '',
        code: '',
        address: '',
        bill_prefix: '',
        receipt_prefix: '',
        pay_prefix: '',
        dn_prefix: '',
        cn_prefix: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEdition(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newEdition);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Edition Name"
                    value={newEdition.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                />
                <input
                    type="text"
                    name="code"
                    placeholder="Edition Code"
                    value={newEdition.code}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={newEdition.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                    type="text"
                    name="bill_prefix"
                    placeholder="Bill Prefix"
                    value={newEdition.bill_prefix}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                    type="text"
                    name="receipt_prefix"
                    placeholder="Receipt Prefix"
                    value={newEdition.receipt_prefix}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                    type="text"
                    name="pay_prefix"
                    placeholder="Pay Prefix"
                    value={newEdition.pay_prefix}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                    type="text"
                    name="dn_prefix"
                    placeholder="DN Prefix"
                    value={newEdition.dn_prefix}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                    type="text"
                    name="cn_prefix"
                    placeholder="CN Prefix"
                    value={newEdition.cn_prefix}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <Button type="button" onClick={onCancel} variant="subtle">Cancel</Button>
                <Button type="submit" color="blue">Save</Button>
            </div>
        </form>
    );
};