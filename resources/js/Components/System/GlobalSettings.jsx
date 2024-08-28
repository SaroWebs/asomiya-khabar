import { Button, Modal, Radio, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react'
import { useState, useEffect } from 'react'

const GlobalSettings = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [info, setInfo] = useState({
        publication: '',
        edition: ''
    });

    useEffect(() => {
        axios.get('/api/active/publication')
            .then(res => {
                if (res.data && res.data.id) {
                    let pub = res.data;
                    let activeEdition = pub.editions.find(ed => ed.active === 1);
                    setInfo({
                        ...info,
                        publication: pub.id.toString(),
                        edition: activeEdition ? activeEdition.id.toString() : '',
                    });
                    if (pub.editions.length > 0 && !activeEdition) {
                        open(); // set edition
                    }
                } else {
                    open(); // set publication
                }
            })
            .catch(err => {
                console.error('Error fetching active publication:', err.message);
            });
    }, []);


    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                withCloseButton={false}
            >
                <SetGlobalDetails info={info} setInfo={setInfo} close={close} />
            </Modal>
        </>
    );
}

export default GlobalSettings



const SetGlobalDetails = ({ info, setInfo, close }) => {
    const [publications, setPublications] = useState([]);



    useEffect(() => {
        axios.get(`/api/publications`).then(res => { setPublications(res.data) }).catch(er => console.log(er.message));
    }, []);

    const handlePublicationChange = (value) => {
        setInfo(prev => ({ ...prev, publication: value }));
    };

    const handleSubmit = () => {
        const promises = [];

        if (info.publication) {
            promises.push(axios.patch(`/publication/${info.publication}/activate`));
        }
        if (info.edition) {
            promises.push(axios.patch(`/edition/${info.edition}/activate`));
        }

        Promise.all(promises)
            .then(() => {
                close();
                window.location.reload();
            })
            .catch(er => console.log(er.message));
    };

    return (
        <div className="space-y-4">
            <Select
                label="Publication"
                placeholder="Select a publication"
                data={publications.map(pub => ({ value: pub.id.toString(), label: pub.name }))}
                value={info.publication}
                onChange={handlePublicationChange}
            />
            {publications.find(pub => pub.id.toString() === info.publication)?.editions.length > 0 && (
                <Select
                    label="Edition"
                    placeholder="Select an edition"
                    data={publications.find(pub => pub.id.toString() === info.publication)?.editions?.map(edition => ({ value: edition.id.toString(), label: edition.name })) || []}
                    value={info.edition}
                    onChange={(value) => setInfo(prev => ({ ...prev, edition: value }))}
                />
            )}

            <Button onClick={handleSubmit}>
                Set Global Settings
            </Button>
        </div>
    );
};