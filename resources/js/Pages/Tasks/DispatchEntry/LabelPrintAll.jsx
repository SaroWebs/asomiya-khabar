import PacketLabel from '@/Components/Print/PacketLabel';
import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

const LabelPrintAll = ({ items }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const printComponentRef = useRef();

    const calculateCopiesPerPacket = (copies, packets) => {
        const copiesPerPacket = Math.floor(copies / packets);
        const remainder = copies % packets;
        return Array.from({ length: packets }, (_, index) =>
            index < remainder ? copiesPerPacket + 1 : copiesPerPacket
        );
    };

    return (
        <>
            <Button color="orange" onClick={open}>
                Print All Labels
            </Button>

            <Modal size={'xl'} opened={opened} onClose={close} title="Confirm Print">
                <div className="mb-4">
                    <p>Total Items: {items.length}</p>
                    <p>Total Packets: {items.reduce((acc, item) => acc + item.packets, 0)}</p>
                    <p>Total Chargable Copies: {items.reduce((acc, item) => acc + item.paid_copies, 0)}</p>
                    <p>Total Free Copies: {items.reduce((acc, item) => acc + item.free_copies, 0)}</p>
                </div>

                <ReactToPrint
                    trigger={() => <Button color='orange'>Confirm & Print</Button>}
                    content={() => printComponentRef.current}
                    onAfterPrint={close}
                />

                <div style={{ display: "none" }}>
                    <div ref={printComponentRef}>
                        {items.map((item, itemIndex) => {
                            const paidCopiesPerPacket = calculateCopiesPerPacket(item.paid_copies, item.packets);
                            const freeCopiesPerPacket = calculateCopiesPerPacket(item.free_copies, item.packets);

                            return Array.from({ length: item.packets }, (_, packetIndex) => (
                                <PacketLabel key={`${itemIndex}-${packetIndex}`} item={item} packetIndex={packetIndex}/>
                            ));
                        })}
                    </div>
                </div>
            </Modal>
        </>
    );
};


export default LabelPrintAll;
