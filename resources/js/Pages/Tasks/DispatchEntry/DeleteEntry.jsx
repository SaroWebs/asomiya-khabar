import { ActionIcon, Button, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react'
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const DeleteEntry = ({ item, reload }) => {

  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`/dispatch/${item.id}`);

      if (response.status === 200 || response.status === 204) {
        reload();
        close();
      } else {
        setError('Failed to delete the item. Please try again.');
      }
    } catch (err) {
      setError('An error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <ActionIcon variant="filled" color="pink" onClick={open} aria-label="Remove Item">
        <FaTrash />
      </ActionIcon>
      <Modal opened={opened} onClose={close} centered>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-center text-3xl text-gray-600 mb-4">
            Are You Sure?
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Group>
            <Button onClick={close} color="gray" disabled={loading}>
              NO
            </Button>
            <Button
              onClick={handleDelete}
              color="pink"
              loading={loading}
              disabled={loading}
            >
              YES
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
}

export default DeleteEntry