import { Link, Head } from '@inertiajs/react';
import { FaArrowRight } from 'react-icons/fa';

export default function Welcome({ auth }) {
    
    return (
        <div className="max-w-screen-2xl">
            <Head title="Log in" />
            <div className="rounded-sm bg-white shadow-default relative">
                <div className="relative w-full h-full grid grid-cols-2 justify-center items-center">
                    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-500">
                        <img src="/static/images/logox.png" alt="" className='bg-white py-8 px-12 rounded-md' />
                    </div>
                    <div className="w-full min-h-[95vh] flex justify-center items-center">
                        <div className="min-w-[450px]">
                            <div className="text-center">
                                <h2 className="mb-9 text-8xl font-bold text-gray-300 cursor-default select-none sm:text-title-xl2">
                                    Welcome {auth.user ? 'Back' : ''}
                                </h2>
                                {auth.user ? (
                                    <div className="flex justify-end">
                                        <Link
                                            href={route('dashboard')}
                                            className="flex items-center gap-3 text-2xl bg-lime-200 text-lime-800 shadow-md rounded-md border-b-2 hover:border-lime-700 px-5 py-2"
                                        >
                                            Dashboard
                                            <FaArrowRight className='w-4 h-4' />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex justify-center">
                                        <Link
                                            href={route('login')}
                                            className="text-2xl bg-rose-200 text-rose-800 shadow-md rounded-md border-b-2 hover:border-rose-700 px-5 py-2"
                                        >
                                            Log in
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


