import { Button, Group, Modal, Loader, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import axios from 'axios';
import AddNewZone from './AddNewZone';

const CreateLocation = (props) => {
    const [opened, { open, close }] = useDisclosure(false);
    const { states, items, reload } = props;
    const [dists, setDists] = useState([]);
    const [zones, setZones] = useState([]);
    const [formInfo, setFormInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleStateSelect = async (e) => {
        let state_code = e.target.value;
        setLoading(true);
        try {
            const districtsRes = await axios.get(`/api/districts?state=${state_code}`);
            const zonesRes = await axios.get(`/api/zones?state=${state_code}`);
            setDists(districtsRes.data);
            setZones(zonesRes.data);

            let state_id = states.find(st => st.code == state_code).id;
            setFormInfo({
                ...formInfo,
                district_id: '',
                zone_id: '',
                state_id,
            });
        } catch (er) {
            setError('Failed to load districts or zones.');
        } finally {
            setLoading(false);
        }
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

    const handleLocationChange = (e) => {
        setFormInfo({
            ...formInfo,
            name: e.target.value,
        });
    };

    const handleSubmit = async () => {
        if (!formInfo.state_id || !formInfo.name) {
            setError('Fill the required fields to proceed.');
            return;
        }

        const duplicate = items && items.length > 0 && items.some(item =>
            item.name.toLowerCase() === formInfo.name.toLowerCase() && item.state_id === formInfo.state_id
        );

        if (duplicate) {
            setError('Location name already exists in the selected state.');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/location/create', formInfo);
            setSuccess('Location created successfully!');
            reload();
        } catch (er) {
            setError('Failed to create location.');
        } finally {
            setLoading(false);
            handleClose();
        }
    };

    const handleClose = () => {
        close();
        setFormInfo({});
        setError('');
        setSuccess('');
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={handleClose}
                title="New Location"
                closeOnClickOutside={false}
                size={'xl'}
                radius={12}
                withCloseButton={false}
            >
                <div className="my-6 flex flex-col gap-4">
                    {error && <Notification color="red" onClose={() => setError('')}>{error}</Notification>}
                    {success && <Notification color="green" onClose={() => setSuccess('')}>{success}</Notification>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700" htmlFor="sts">State : <span className='text-red-600'>*</span></label>
                            <select
                                className="text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                                id="sts"
                                name="sts"
                                defaultValue={''}
                                onChange={handleStateSelect}
                                disabled={loading}
                            >
                                <option value="" disabled>Select State</option>
                                {states.length > 0 && states.map(st => (
                                    <option key={st.code} value={st.code}>{st.name + " ( " + st.code + " )"}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700" htmlFor="dsts">District :</label>
                            <select
                                className="text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                                name="dsts"
                                defaultValue={''}
                                value={formInfo.district_id}
                                onChange={handleDistrictSelect}
                                disabled={loading || !dists.length}
                            >
                                <option value="" disabled>Select District</option>
                                {dists.length > 0 && dists.map(ds => (
                                    <option key={ds.id} value={ds.id}>{ds.name + " ( " + ds.district_code + " )"}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <label className="text-xs font-semibold text-gray-700" htmlFor="zns">Zone :</label>
                                <AddNewZone type={'text'} reload={reload} />
                            </div>
                            <select
                                className="text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                                name="zns"
                                defaultValue={''}
                                value={formInfo.zone_id}
                                onChange={handleZoneSelect}
                                disabled={loading || !zones.length}
                            >
                                <option value="" disabled>Select Zone</option>
                                {zones.length > 0 && zones.map(zs => (
                                    <option key={zs.id} value={zs.id}>{zs.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-700" htmlFor="lname">
                            Location name : <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type="text"
                            className="text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                            value={formInfo.name}
                            defaultValue={''}
                            onChange={handleLocationChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Group>
                            <Button variant='light' onClick={handleClose} disabled={loading}>
                                Close
                            </Button>
                            <Button onClick={handleSubmit} loading={loading}>
                                Create
                            </Button>
                        </Group>
                    </div>
                </div>
            </Modal>

            <Button onClick={open}>Create New</Button>
        </>
    );
};

export default CreateLocation;

