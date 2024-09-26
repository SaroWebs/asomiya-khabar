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

    const company = "Frontier Publications Pvt. Ltd.";
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
                <div className="flex flex-col p-4 mb-6 " key={index}>
                    <div className="text-center">
                        <h3 className='text-xl font-semibold underline'>{item.publication.name}</h3>
                        <p>{company}</p>
                    </div>
                    <div className="flex justify-end">
                        <span>Date {item.date}</span>
                    </div>
                    <div className="mt-2">
                        <div className="grid grid-cols-4">
                            <div className="col-span-3 flex gap-3">
                                <span className='text-xl'>To:</span>
                                <h4 className='text-2xl font-bold'>{item.agent.name}</h4>
                            </div>
                            <div className="">
                                <span className="text-2xl">Pkt # {index + 1}/{item.packets}</span>
                            </div>
                        </div>
                        <hr className="my-2" />
                        <div className="grid grid-cols-3">
                            <div className="col-span-2">
                                <ul className="">
                                    <li>Chargable: {paidCopiesPerPacket[index]}</li>
                                    <li>Contemporary: {freeCopiesPerPacket[index]}</li>
                                </ul>
                            </div>
                            <div className="flex items-center justify-center">
                                <h4 className='text-3xl font-bold'>
                                    Total: {paidCopiesPerPacket[index] + freeCopiesPerPacket[index]}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
})



export default LabelPrint
