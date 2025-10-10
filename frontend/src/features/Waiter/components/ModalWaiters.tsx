import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import ActionForm from './ActionForm';
import { useModalProvider } from '../hooks/useModalProvider';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function ModalWaiters() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { ButtonName } = useModalProvider()

  return (
    <div className='lg:self-end md:self-start overflow-auto'>
        <Button variant='contained' onClick={handleOpen} className='gap-2.5'
          sx= {{
            backgroundColor:  "#0F766E",
            color: "#fff",
            border: "#0F766E",
            "&:active": {
                  backgroundColor: "#fff", 
                 },
            "&:hover": {
                  backgroundColor: "#115E59",
                  color: "#fff"
                },
            }}
        >
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
            <div className="fixed inset-0 flex items-center justify-center p-4" onClick={handleClose}>
                <div onClick={(e) => e.stopPropagation()} className='bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
                    <ActionForm/>
                </div>
            </div>
        </Fade>
      </Modal>
    </div>
  );
}
