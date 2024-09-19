import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { Modal, Button, TextInput, Select, Textarea } from '@mantine/core';
import { useEffect } from 'react';

const NewConsumer = (props) => {
    const { variant = 'button', reload } = props;
    const [opened, { open, close }] = useDisclosure(false);
    const [cTypes, setCTypes] = useState([]);
    const [cRoutes, setCRoutes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [formInfo, setFormInfo] = useState({
        name: '',
        consumer_type_id: '',
        location_id: '',
        circulation_route_id: '',
        address: '',
        pin: '',
        phone: '',
        fax: '',
        email: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        let fd = new FormData();
        for (let key in formInfo) {
            fd.append(key, formInfo[key]);
        }
        axios.post('/consumer/create', fd).then(res => {
            reload();
            handleClose();
        }).catch(err => {
            console.log(err.message);
        });
    };

    const handleClose = () => {
        setFormInfo({
            name: '',
            consumer_type_id: '',
            location_id: '',
            circulation_route_id: '',
            address: '',
            pin: '',
            phone: '',
            fax: '',
            email: ''
        });
        close();
    };

    useEffect(() => {
        getCTypes();
        getLocations();
        getCRoutes();
    }, [])

    const getCTypes = () => {
        axios.get(`/api/consumer/types`).then(res => {
            setCTypes(res.data);
        }).catch(err => {
            console.log(err.message);
        })
    }

    const getLocations = () => {
        axios.get(`/api/locations`).then(res => {
            setLocations(res.data);
        }).catch(err => {
            console.log(err.message);
        });
    }

    const getCRoutes = () => {
        axios.get(`/api/c-routes`).then(res => {
            setCRoutes(res.data);
        }).catch(err => {
            console.log(err.message);
        });
    }
    
    return (
        <>
            {variant == 'button' && <Button className={props.className} onClick={open}>Add Consumer</Button>}
            {variant == 'string' && <span className={props.className} onClick={open}>Add Consumer</span>}
            <Modal
                opened={opened}
                onClose={handleClose}
                title="Add Consumer"
                size={'xl'}
                className='p-6'
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-2 my-2">
                        <TextInput
                            label="Consumer Name"
                            placeholder="Enter consumer name"
                            value={formInfo.name}
                            onChange={(event) => setFormInfo({ ...formInfo, name: event.target.value })}
                            required
                        />
                        <Select
                            label="Consumer Type"
                            placeholder="Select consumer type"
                            className='capitalize'
                            data={cTypes.map(type => ({ value: type.id.toString(), label: type.name }))}
                            value={formInfo.consumer_type_id}
                            onChange={(value) => setFormInfo({ ...formInfo, consumer_type_id: value })}
                        />
                        <Select
                            label="Location"
                            placeholder="Select location"
                            className='capitalize'
                            data={locations.map(loc => ({
                                value: loc.id.toString(),
                                label: `${loc.name} - ${loc.zone ? `(${loc.zone.name})` : ''}`
                            }))}
                            value={formInfo.location_id}
                            onChange={(value) => setFormInfo({ ...formInfo, location_id: value })}
                        />
                        <Select
                            label="Circulation Route"
                            placeholder="Select circulation route"
                            className='capitalize'
                            data={cRoutes.map(route => {
                                const fromLoc = locations.find(loc => loc.id === route.from_location);
                                const toLoc = locations.find(loc => loc.id === route.to_location);
                                let lbl = `${fromLoc ? fromLoc.name : route.from_location} - ${toLoc ? toLoc.name : route.to_location}`;
                                return ({ value: route.id.toString(), label: lbl});
                            })}
                            value={formInfo.circulation_route_id}
                            onChange={(value) => setFormInfo({ ...formInfo, circulation_route_id: value })}
                        />
                        <TextInput
                            label="Phone"
                            placeholder="Enter phone number"
                            value={formInfo.phone}
                            onChange={(event) => setFormInfo({ ...formInfo, phone: event.target.value })}
                        />
                        <TextInput
                            label="Email"
                            placeholder="Enter email"
                            value={formInfo.email}
                            onChange={(event) => setFormInfo({ ...formInfo, email: event.target.value })}
                        />
                        <TextInput
                            label="Fax"
                            placeholder="Enter fax number"
                            value={formInfo.fax}
                            onChange={(event) => setFormInfo({ ...formInfo, fax: event.target.value })}
                        />
                        <TextInput
                            label="PIN"
                            placeholder="Enter PIN"
                            value={formInfo.pin}
                            onChange={(event) => setFormInfo({ ...formInfo, pin: event.target.value })}
                        />
                        <Textarea
                            className='md:col-span-2'
                            label="Address"
                            placeholder="Enter address"
                            value={formInfo.address}
                            onChange={(event) => setFormInfo({ ...formInfo, address: event.target.value })}
                        />
                    </div>
                    <Button type="submit">Add Consumer</Button>
                </form>
            </Modal>
        </>
    );
};

export default NewConsumer;