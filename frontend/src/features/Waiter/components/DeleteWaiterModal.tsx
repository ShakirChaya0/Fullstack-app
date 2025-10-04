import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import ConfirmDelete from './ConfirmDelete';
import type { Waiter } from '../interfaces/Waiters';

export default function DeleteWaiterModal({handleDeleteMozo, Waiter}: {handleDeleteMozo: (id: string) => void, Waiter: Waiter}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className='lg:self-end md:self-start'>
        <Button variant="contained" color="error" onClick={handleOpen}>
          Eliminar
        </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <ConfirmDelete handleDeleteMozo={handleDeleteMozo} Waiter={Waiter} open={open} onClose={handleClose}/>
            </div>
        </Fade>
      </Modal>
    </div>
  );
}
