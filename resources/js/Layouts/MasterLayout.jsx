import React, { useState } from 'react'
import Header from '@/Components/Navigation/Header';
import Sidebar from '@/Components/Navigation/Sidebar';
import { MdDashboard } from 'react-icons/md';
import { FaCogs, FaFileAlt, FaFileContract, FaTasks, FaUserCog } from 'react-icons/fa';
import GlobalSettings from '@/Components/System/GlobalSettings';



const mockdata = [
    {
        label: 'Dashboard', 
        icon: MdDashboard , 
        link:'/dashboard'
    },
    {
        label: 'Master Configuration',
        icon: FaCogs,
        links: [
            { label: 'Locations', link: '/master/locations' },
            { label: 'Publications', link: '/master/publications' },
            { label: 'Agents', link: '/master/agents' },
            { label: 'Consumers', link: '/master/consumers' },
            { label: 'Subscribers', link: '/master/subscribers' },
        ],
    },
    {
        label: 'Tasks',
        icon: FaTasks,
        links: [
            { label: 'Dispatch Entry', link: '/task/dispatch-entry' },
            // { label: 'Label printing', link: '/task/label-printing' },
            { label: 'Print Order', link: '/task/print-order' },
            { label: 'Challan Generation', link: '/task/challan' },
            { label: 'Dispatch Checklist', link: '/task/dispatch-checklist' },
            { label: 'Unsold Return Entry', link: '/task/unsold-return-entry' },
        ],
    },

    {
        label: 'Register',
        icon: FaFileAlt,
        links: [
            { label: 'Sales Register', link: '/register/sales-register' },
            { label: 'Bill Register', link: '/register/bill-register' },
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
    const {app}=props;
    return (
        <div>
            <div className="flex h-screen overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} mockdata={mockdata} auth={props.auth}/>
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} {...props} />
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-2 md:p-3">
                            {props.children}
                        </div>
                    </main>
                    <footer className="fixed z-[999999] bottom-0 left-0 right-0 bg-black/10 py-2 px-6">
                        <div className="flex justify-end gap-3">
                            <span className="text-xs font-thin">v {app.version}</span>
                            <span className="text-xs font-thin text-cyan-700 capitalize">( {app.environment} )</span>
                            {/* <span className="text-xs font-thin bg-red-800 text-white px-2 capitalize rounded-full">Debugging: {app.debug?"True":"False"}</span> */}
                        </div>
                    </footer>
                </div>
                <GlobalSettings />
            </div>
        </div>
    );
}

export default MasterLayout