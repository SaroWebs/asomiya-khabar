import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const index = (props) => {
    const [publications, setPublications] = useState([]);


    const loadData=()=>{
        axios.get(`/api/publications`).then(res => { setPublications(res.data) }).catch(er => console.log(er.message));
    }

    useEffect(() => {
      console.log(publications);
    }, [publications]);


    useEffect(() => {
      loadData();
    }, [])
    
    return (
        <MasterLayout {...props}>
            <Head title="Publications" />
            <div className="">
                Publications
                
            </div>
        </MasterLayout>
    )
}

export default index