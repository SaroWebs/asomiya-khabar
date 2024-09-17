import { ScrollArea } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react'
import { LuXCircle } from 'react-icons/lu';
import { RiLogoutCircleLine } from "react-icons/ri";

import ApplicationLogo from '../ApplicationLogo';
import { Link } from '@inertiajs/react';
import { FaUserCog } from 'react-icons/fa';


const Sidebar = (props) => {
	const { sidebarOpen, setSidebarOpen, mockdata, auth } = props;
	const trigger = useRef();
	const sidebar = useRef();

	const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
	const [sidebarExpanded, setSidebarExpanded] = useState(
		storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
	);

	const [openMenuIndex, setOpenMenuIndex] = useState(null);

	useEffect(() => {
		const clickHandler = ({ target }) => {
			if (!sidebar.current || !trigger.current) return;
			if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
			setSidebarOpen(false);
		};
		document.addEventListener('click', clickHandler);
		return () => document.removeEventListener('click', clickHandler);
	});

	useEffect(() => {
		const keyHandler = ({ keyCode }) => {
			if (!sidebarOpen || keyCode !== 27) return;
			setSidebarOpen(false);
		};
		document.addEventListener('keydown', keyHandler);
		return () => document.removeEventListener('keydown', keyHandler);
	});

	useEffect(() => {
		localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
		if (sidebarExpanded) {
			document.querySelector('body')?.classList.add('sidebar-expanded');
		} else {
			document.querySelector('body')?.classList.remove('sidebar-expanded');
		}
	}, [sidebarExpanded]);

	useEffect(() => {
		const activeIndex = mockdata.findIndex(item => 
			item.link === window.location.pathname || 
			(item.links && item.links.some(link => link.link === window.location.pathname))
		);
		setOpenMenuIndex(activeIndex);
	}, []);

	return (
		<aside
			ref={sidebar}
			className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-auto shadow-md bg-gradient-to-r from-cyan-700 to-blue-800 duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
		>
			<nav className="absolute left-0 top-0 z-50  w-full px-4 py-6 flex flex-col text-white">
				<div className="m-2 p-2 flex justify-between items-center">
					<div className="">
						<ApplicationLogo className="block h-12 fill-current p-1 rounded-md bg-white" />
					</div>
					<button
						ref={trigger}
						onClick={() => setSidebarOpen(!sidebarOpen)}
						aria-controls="sidebar"
						aria-expanded={sidebarOpen}
						className="block lg:hidden"
					>
						<LuXCircle className='h-8 w-8' />
					</button>
				</div>

				<hr className='my-2 p-0.5 border-none bg-gradient-to-r from-orange-700 via-purple-600 to-yellow-400 rounded-full' />
				<ScrollArea h={400}>
					<div className={``}>
						{mockdata.map((mock, i) => (
							<MenuItem 
								item={mock} 
								key={i} 
								isOpen={openMenuIndex === i}
								onToggle={() => setOpenMenuIndex(openMenuIndex === i ? null : i)}
							/>
						))}
					</div>
				</ScrollArea>
				<hr className="my-2 p-0.5 border-none bg-gradient-to-r from-orange-700 via-purple-600 to-yellow-400 rounded-full" />
				<div className="w-full gap-2 flex flex-col">
					<Link href={route('profile.edit')} className="flex gap-2 items-center p-2 rounded-md hover:shadow-md hover:bg-white/10 hover:text-orange-200 cursor-pointer">
						<FaUserCog className="w-6 h-6" />
						Account
					</Link>
					<Link href={route('logout')} method="post" as="button" className="flex gap-2 items-center p-2 rounded-md hover:shadow-md hover:bg-white/10 hover:text-orange-200 cursor-pointer">
						<RiLogoutCircleLine className='w-6 h-6' />
						Logout
					</Link>
				</div>
			</nav>
			<div className="absolute left-0 right-0 bottom-0 min-h-8 py-3 text-white bg-black/30">
				<div className="flex justify-center items-center">
					<div className='text-xs '>Developed by <Link href={`https://www.vasptechnologies.com/`} className="text-yellow-400 font-bold">VASP Technologies Pvt. Ltd.</Link></div>
				</div>
			</div>
		</aside>
	);
}

const MenuItem = ({ item, isOpen, onToggle }) => {
	const pathname = window.location.pathname;
	const isActive = item.link === pathname || (item.links && item.links.some(link => link.link === pathname));

	return (
		<div key={item.label} className='mr-4'>
			<div 
				className={`flex items-center space-x-2 p-2 py-3 rounded-md hover:shadow-md hover:bg-white/10 hover:text-orange-200 cursor-pointer ${isActive ? 'text-orange-300 font-bold shadow-md bg-white/10' : ''}`} 
				onClick={onToggle}
			>
				<item.icon className='w-6 h-6' />
				{item.link ? (
					<Link href={item.link}>{item.label}</Link>
				) : (
					<span>{item.label}</span>
				)}
			</div>
			{item.links && isOpen && (
				<div className="mx-4">
					{item.links.map((m) => (
						<Link 
							href={m.link} 
							key={m.label} 
							className={`block py-2 pl-6 rounded-md hover:shadow-md hover:bg-white/10 hover:text-orange-200 cursor-pointer ${m.link === pathname ? 'text-orange-300 font-bold shadow-md' : ''}`}
						>
							{m.label}
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default Sidebar