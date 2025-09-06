import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import ActionForm from './ActionForm';
import { useModalProvider } from '../hooks/useModalProvider';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function ModalNews() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { ButtonName } = useModalProvider()

  return (
    <div className='lg:self-end md:self-start'>
        <Button variant='contained' onClick={handleOpen} className='gap-2.5'>
          {(ButtonName.includes("Crear")) && <AddCircleOutlineIcon/>}
            {ButtonName}
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
                <ActionForm/>
            </div>
        </Fade>
      </Modal>
    </div>
  );
}
