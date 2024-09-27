import React from 'react';

const PacketLabel = ({ item, packetIndex }) => {
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
        <div className="flex flex-col p-4 mb-6">
            <div className="text-center">
                <h3 className='text-xl font-semibold underline'>{item.publication.name}</h3>
                <p>Frontier Publications Pvt. Ltd.</p>
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
                    <div>
                        <span className="text-2xl">Pkt # {packetIndex + 1}/{item.packets}</span>
                    </div>
                </div>
                <hr className="my-2" />
                <div className="grid grid-cols-3">
                    <div className="col-span-2">
                        <ul>
                            <li>Chargable: {paidCopiesPerPacket[packetIndex]}</li>
                            <li>Contemporary: {freeCopiesPerPacket[packetIndex]}</li>
                        </ul>
                    </div>
                    <div className="flex items-center justify-center">
                        <h4 className='text-3xl font-bold'>
                            Total: {paidCopiesPerPacket[packetIndex] + freeCopiesPerPacket[packetIndex]}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PacketLabel;
