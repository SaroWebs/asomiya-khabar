import PacketLabel from '@/Components/Print/PacketLabel';
import { Button } from '@mantine/core'
import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print'

const LabelPrint = ({ item }) => {
    const componentRef = useRef();

    return (
        <>
            <ReactToPrint
                trigger={() => <Button size='xs' color='orange'>Print Label</Button>}
                content={() => componentRef.current}
            />
            <div style={{ display: "none" }}>
                <PrintLayout ref={componentRef} item={item} />
            </div>
        </>
    )
}
const PrintLayout = React.forwardRef(({ item }, ref) => {

    const calculateCopiesPerPacket = (copies, packets) => {
        const copiesPerPacket = Math.floor(copies / packets);
        const remainder = copies % packets;
        return Array.from({ length: packets }, (_, index) =>
            index < remainder ? copiesPerPacket + 1 : copiesPerPacket
        );
    };

    const paidCopiesPerPacket = calculateCopiesPerPacket(item.paid_copies, item.packets);
    const freeCopiesPerPacket = calculateCopiesPerPacket(item.free_copies, item.packets);

    return (
        <div className="" ref={ref}>
            {Array.from({ length: item.packets }, (_, index) => (
                <PacketLabel key={index} item={item} packetIndex={0}/>
            ))}
        </div>
    );
})



export default LabelPrint
