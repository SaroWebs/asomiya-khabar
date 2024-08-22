import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react'
import { useState, useEffect } from 'react'

const GlobalSettings = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [info, setInfo] = useState({
        publication: '',
        session: '',
        edition: ''
    })

    useEffect(() => {
        axios.get('/api/active/publication')
            .then(res => {
                setInfo({ ...info, publication: res.data })
            })
            .catch(err => {
                console.log(err.message);
            });
    }, []);

    useEffect(() => {
        if (!info.publication) {
            // open();
        }
    }, [info]);

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                withCloseButton={false}
            >
                Set Publication
            </Modal>
        </>
    );
}

export default GlobalSettings