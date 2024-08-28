import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { AddNewPublication } from './AddNew'
import Editions from './Editions'
import { Switch } from '@mantine/core';

const index = (props) => {
    const [publications, setPublications] = useState([]);


    const loadData = () => {
        axios.get(`/api/publications`).then(res => { setPublications(res.data) }).catch(er => console.log(er.message));
    }

    useEffect(() => {
        loadData();
    }, [])

    const handleStatusChange = async (id, newStatus) => {
        if (newStatus) {
            try {
                await axios.patch(`/publication/${id}`, { is_active: newStatus });
                window.location.reload();
            } catch (error) {
                console.error('Error updating publication status:', error);
            }
        }
    };

    return (
        <MasterLayout {...props}>
            <Head title="Publications" />
            <div className="flex flex-col m-4 p-4 shadow-md rounded-lg">
                <div className="">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Publications</h1>
                        <div>
                            <AddNewPublication publications={publications} reload={loadData}/>
                        </div>
                    </div>
                </div>
                <div className="my-4">
                    {publications.length > 0 ? (
                        <div className="">
                            <div className="mb-4">
                                {/*  */}
                            </div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {publications.map(pub => (
                                        <tr key={pub.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{pub.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{pub.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{pub.frequency}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{pub.parent ? pub.parent.name : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Switch
                                                    checked={pub.active}
                                                    onChange={(event) => handleStatusChange(pub.id, event.currentTarget.checked)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <RemoveItem id={pub.id} name={pub.name} reload={loadData} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No publications found.</p>
                    )}
                </div>

                <hr className="my-6" />
                
                <div className="editions-section">
                    <h2 className="text-2xl font-bold mb-4">Editions</h2>
                    <Editions publications={publications}/>
                </div>

            </div>
        </MasterLayout>
    )
}

export default index



const RemoveItem = (props) => {
    const { id, name, reload } = props;
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await axios.delete(`/publication/${id}`);
            reload();
            setIsConfirmOpen(false);
        } catch (error) {
            console.error('Error deleting publication:', error);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsConfirmOpen(true)}
                className="text-red-600 hover:text-red-900"
            >
                Delete
            </button>

            {isConfirmOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete "{name}"?</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};