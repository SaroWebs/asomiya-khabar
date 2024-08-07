import { ScrollArea } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react'
import { LuXCircle } from 'react-icons/lu';
import ApplicationLogo from '../ApplicationLogo';


const Sidebar = (props) => {
	const { sidebarOpen, setSidebarOpen, mockdata } = props;
	const trigger = useRef();
	const sidebar = useRef();

	const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
	const [sidebarExpanded, setSidebarExpanded] = useState(
		storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
	);

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

	return (
		<aside
			ref={sidebar}
			className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden shadow-md bg-gradient-to-r from-cyan-700 to-blue-800 duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
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

				<hr className='text-white/50 my-4' />
				<ScrollArea h={600}>
					<div className={``}>
						{mockdata.map((mock, i) => <MenuItem item={mock} key={i} />)}
					</div>
				</ScrollArea>
			</nav>
		</aside>
	);
}

export default Sidebar

const MenuItem = ({ item }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = window.location.pathname;
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    useEffect(() => {
        if (item.initiallyOpened) {
            setMenuOpen(true);
        }
    }, []);
    const isActive = item.link === pathname || (item.links && item.links.some(link => link.link === pathname));

    return (
        <div key={item.label} className='mr-4'>
            <div className={`flex items-center space-x-2 p-2 py-3 rounded-md hover:shadow-md hover:bg-white/10 hover:text-orange-200 cursor-pointer ${isActive ? 'text-orange-300 font-bold shadow-md bg-white/10' : ''}`} onClick={toggleMenu}>
                <item.icon className='w-6 h-6' />
                {item.link ? (
                    <a href={item.link}>{item.label}</a>
                ) : (
                    <span>{item.label}</span>
                )}
            </div>
            {item.links && menuOpen && (
                <div className="mx-4">
                    {item.links.map((m) => (
                        <a href={m.link} key={m.label} className={`block py-2 pl-6 rounded-md hover:shadow-md hover:bg-white/10 hover:text-orange-200 cursor-pointer ${m.link === pathname ? 'text-orange-300 font-bold shadow-md' : ''}`}>
                            {m.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};