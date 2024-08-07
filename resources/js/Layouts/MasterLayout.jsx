import React, { useState } from 'react'
import Header from '@/Components/Navigation/Header';
import Sidebar from '@/Components/Navigation/Sidebar';
import { MdDashboard } from 'react-icons/md';
import { FaCogs, FaFileAlt, FaFileContract, FaTasks, FaUserCog } from 'react-icons/fa';



const mockdata = [
    { label: 'Dashboard', icon: MdDashboard , link:'/dashboard'},
    {
        label: 'Master Configuration',
        icon: FaCogs,
        initiallyOpened: true,
        links: [
            { label: 'Overview', link: '/' },
            { label: 'Agents', link: '/' },
            { label: 'Subagents', link: '/' },
            { label: 'Consumers', link: '/' },
            { label: 'Publications', link: '/' },
            { label: 'Locations', link: '/' },
            { label: 'Test', link: '/test' },
        ],
    },
    {
        label: 'Tasks',
        icon: FaTasks,
        links: [
            { label: 'Dispatch Entry', link: '/' },
            { label: 'Label printing', link: '/' },
            { label: 'Print Order', link: '/' },
            { label: 'Challan Generation', link: '/' },
            { label: 'Dispatch Checklist', link: '/' },
            { label: 'Unsold Return Entry', link: '/' },
        ],
    },
    {
        label: 'Register',
        icon: FaFileAlt,
        links: [
            { label: 'Sales Register', link: '/' },
            { label: 'Bill Register', link: '/' },
            { label: 'Security Deposit', link: '/' },
            { label: 'Receipts', link: '/' },
            { label: 'Payments', link: '/' },
            { label: 'Debit Note', link: '/' },
            { label: 'Credit Note', link: '/' },
        ],
    },
    {
        label: 'Report',
        icon: FaFileContract,
        links: [
            { label: 'Debtor Ledger', link: '/' },
            { label: 'Publication wise Outstandings', link: '/' },
            { label: 'Consolidated Outstandings', link: '/' },
            { label: 'Short Receipts', link: '/' },
            { label: 'Circulation Summary', link: '/' },
            { label: 'Business Summary', link: '/' },
            { label: 'Commission Summary', link: '/' },
            { label: 'Circulation Breakup', link: '/' },
            { label: 'Print Order Summary', link: '/' },
            { label: 'Delivery Sheet', link: '/' },
            { label: 'Monthly Sales Analysis', link: '/' },
            { label: 'Agency Analysis', link: '/' },
        ],
    },
    { label: 'Settings', icon: FaUserCog, link: '/' },
];

const MasterLayout = (props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div>
            <div className="flex h-screen overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} mockdata={mockdata}/>
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} {...props} />
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-2 md:p-3">
                            {props.children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default MasterLayout