import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import React from 'react'
import { useState, useEffect } from 'react';
import { HiOutlineBars3 } from 'react-icons/hi2';

const Header = (props) => {
    const { sidebarOpen, setSidebarOpen } = props;
    const [info, setInfo] = useState({
        publication: '',
        edition: '',
        sess: '',
    });

    useEffect(() => {
        const fetchActivePublication = axios.get('/api/active/publication');
        const fetchActiveFinSession = axios.get('/api/active/finsession');

        Promise.all([fetchActivePublication, fetchActiveFinSession])
            .then(([publicationRes, sessionRes]) => {
                const newInfo = { ...info };

                if (publicationRes.data && publicationRes.data.id) {
                    const pub = publicationRes.data;
                    const activeEdition = pub.editions.find(ed => ed.active === 1);
                    newInfo.publication = pub;
                    newInfo.edition = activeEdition;
                }

                if (sessionRes.data) {
                    newInfo.sess = sessionRes.data;
                }

                setInfo(newInfo);
            })
            .catch(err => {
                console.error('Error fetching data:', err.message);
            });
    }, []);

    
    return (
        <header className="sticky top-0 z-40 flex min-h-14 w-full bg-white shadow-md">
            <div className="flex flex-grow items-center justify-between py-2 px-4 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSidebarOpen(!sidebarOpen);
                        }}
                        className="bg-white p-1.5 shadow-sm lg:hidden"
                    >
                        <HiOutlineBars3 className='w-6 h-6' />
                    </button>
                    <Link className="block flex-shrink-0 lg:hidden" href="/dashboard">
                        <ApplicationLogo className="block h-10 fill-current" />
                    </Link>
                </div>
                <div className="flex items-center gap-3 2xsm:gap-7">
                    <div className="flex flex-col items-end">
                        <span className='text-xs'>{info.publication.name} {info.edition ? `( ${info.edition.name} )` : ''} </span>
                        <span className='text-xs'>Session({info.sess.title})</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header