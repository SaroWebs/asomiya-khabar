import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import LocationList from './LocationList';

const index = (props) => {
    const { states } = props;
    const [selected, setSelected] = useState({
        state: '',
        district: '',
        zone: ''
    });

    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [dists, setDists] = useState([]);
    const [zones, setZones] = useState([]);

    const loadData = () => {
        if (selected.state) {
            axios.get(`/api/districts?state=${selected.state}`).then(res => { setDists(res.data) }).catch(er => console.log(er.message));
            axios.get(`/api/zones?state=${selected.state}`).then(res => { setZones(res.data) }).catch(er => console.log(er.message));
            axios.get(`/api/locations?state=${selected.state}`).then(res => { setItems(res.data) }).catch(er => console.log(er.message));
        } else {
            axios.get(`/api/locations`).then(res => { setItems(res.data) }).catch(er => console.log(er.message));
        }

        if (selected.district) {
            let fi = items.filter(ix => ix.district_id == selected.district);
            setFilteredItems(fi);
        }

        if (selected.zone) {
            let fi = items.filter(ix => ix.zone_id == selected.zone);
            setFilteredItems(fi);
        }

    }

    const handleStateSelect = (e) => {
        let code = e.target.value;
        setSelected({ ...selected, state: code })
    }

    const handleDistrictSelect = (e) => {
        let did = e.target.value;
        if (did) {
            let fi = items.filter(ix => ix.district_id == did);
            setFilteredItems(fi);
            setSelected({ ...selected, district: did, zone: '' });
        } else {
            loadData();
        }
    }

    const handleZoneSelect = (e) => {
        let zid = e.target.value;
        if (zid) {
            let fid = items;
            if (selected.district) {
                fid = items.filter(ix => ix.district_id == selected.district);
            }

            let fi = fid.filter(ix => ix.zone_id == zid);

            setFilteredItems(fi);

            setSelected({ ...selected, zone: zid });
        } else {
            loadData();
        }
    }

    useEffect(() => {
        loadData();
    }, []);
    useEffect(() => {
        loadData();
    }, [selected.state]);

    useEffect(() => {
        setFilteredItems(items);
    }, [items])

    return (
        <MasterLayout {...props}>
            <Head title="Dashboard" />
            <div className="flex flex-col m-4 p-4 shadow-md rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-700" htmlFor="sts">State :</label>
                        <select className="text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300" id="sts" name="sts" value={selected.state} onChange={handleStateSelect}>
                            <option value="" disabled>Select State</option>
                            {states.length > 0 && states.map(st => (
                                <option key={st.code} value={st.code}>{st.name + " ( " + st.code + " )"}</option>
                            ))}
                        </select>
                    </div>

                    {dists.length > 0 && (
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700" htmlFor="dsts">District :</label>
                            <select className="text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300" name="dsts" defaultValue={''} onChange={handleDistrictSelect}>
                                <option value="">Select District</option>
                                {dists.map(ds => (
                                    <option key={ds.id} value={ds.id}>{ds.name + " ( " + ds.district_code + " )"}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {zones.length > 0 && (
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700" htmlFor="zns">Zone :</label>
                            <select className="text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300" name="zns" defaultValue={''} onChange={handleZoneSelect}>
                                <option value="">Select Zone</option>
                                {zones.map(zs => (
                                    <option key={zs.id} value={zs.id}>{zs.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <hr className='my-2' />

                <div className="my-4">
                    <LocationList items={filteredItems} states={states} reload={loadData} />
                </div>
            </div>
        </MasterLayout>
    )
}

export default index