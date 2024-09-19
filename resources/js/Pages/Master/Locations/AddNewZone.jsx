import { Button, Group, Modal, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react'

const AddNewZone = (props) => {
    const { type = 'button', reload } = props;
    const [opened, { open, close }] = useDisclosure(false);
    const [states, setStates] = useState([]);
    const [zones, setZones] = useState([]);
    const [formInfo, setFormInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleClose = () => {
        setFormInfo({});
        setError('');
        setSuccess('');
        close();
    };

    useEffect(() => {
        setFormInfo({});
        setError('');
        setSuccess('');
        getData();
    }, []);
    
    const getData=()=>{
        axios.get(`/api/states`).then(res => { setStates(res.data) }).catch(er => console.log(er.message));
        axios.get(`/api/zones`).then(res => { setZones(res.data) }).catch(er => console.log(er.message));
    }

    const handleSubmit = async () => {
        if (!formInfo.state_code || !formInfo.name) {
            setError('Fill the required fields to proceed.');
            return;
        }

        const duplicate = zones.some(item =>
            item.name.toLowerCase() === formInfo.name.toLowerCase() && item.state_code === formInfo.state_code
        );

        if (duplicate) {
            setError('Zone name already exists in the selected state.');
            return;
        }
        
        setLoading(true);
        try {
            await axios.post('/zone/create', formInfo);
            setSuccess('Zone created successfully!');
            setFormInfo({});
            reload();
        } catch (er) {
            setError('Failed to create location.');
        } finally {
            setLoading(false);
            close();
        }
    };

    const handleStateSelect = async (e) => {
        let state_code = e.target.value;
        setLoading(true);
        try {
            const zonesRes = await axios.get(`/api/zones?state=${state_code}`);
            setZones(zonesRes.data);
            setFormInfo({
                ...formInfo,
                state_code,
            });
        } catch (er) {
            setError('Failed to load zones.');
        } finally {
            setLoading(false);
        }
    };

    const handleZoneChange = (e) => {
        setFormInfo({
            ...formInfo,
            name: e.target.value,
        });
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={handleClose}
                title="New Zone"
                closeOnClickOutside={false}
                size={'md'}
                radius={10}
                withCloseButton={false}
            >
                <div className="my-6 flex flex-col gap-4">
                    {error && <Notification color="red" onClose={() => setError('')}>{error}</Notification>}
                    {success && <Notification color="green" onClose={() => setSuccess('')}>{success}</Notification>}

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
                        <label className="text-xs font-semibold text-gray-700" htmlFor="zname">
                            Zone name : <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type="text"
                            className="text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                            value={formInfo.name}
                            onChange={handleZoneChange}
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

            {type == 'text' && <button className='text-xs underline text-red-700' onClick={open}>Add New Zone</button>}
            {type == 'button' && <Button onClick={open}>Add New</Button>}
        </>
    );
}


export default AddNewZone