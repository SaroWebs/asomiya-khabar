import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MasterLayout from '@/Layouts/MasterLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard(props) {

    return (
        <MasterLayout {...props}>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Welcome to Asomiya Khabar Dashboard</div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
}
