import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';

import { Modal, Button, TextInput } from '@mantine/core';

const AddConsumerType = (props) => {
  const { variant = 'button' } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    let fd = new FormData();
    fd.append('name',name);
    axios.post('/consumer_type/create', fd).then(res=>{
      console.log(res.data);
    }).catch(err=>{
      console.log(err.message);
    });
    close();
  };

  return (
    <>
      {variant == 'button' && <Button className={props.className} onClick={open}>Add Consumer Type</Button>}
      {variant == 'string' && <span className={props.className} onClick={open}>Add Consumer Type</span>}
      <Modal
        opened={opened}
        onClose={close}
        title="Add Consumer Type"
      >
        <form onSubmit={handleSubmit}>
          <div className="rounded p-4 flex flex-col gap-4 ">
            <TextInput
              label="Consumer Type Name"
              placeholder="Enter consumer type name"
              className='w-full'
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <Button type="submit">Add Consumer Type</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddConsumerType;