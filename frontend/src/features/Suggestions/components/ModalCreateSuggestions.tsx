import { useCallback, useState } from 'react';
import { Modal, Fade, Button, Backdrop } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import SuggestionForm from './SuggestionForm';

export default function ModalCreateSuggestions() {
    const [open, setOpen] = useState(false);
    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), [])

    return (
        <div>
            <Button variant="contained" startIcon={<ControlPointIcon/>} onClick={handleOpen}>Crear Sugerencia</Button>
            <Modal
                aria-labelledby="Crear Sugerencia"
                aria-describedby="Formulario para crear una nueva sugerencia"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
                className='m-4'
            >
                <Fade in={open}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                        <SuggestionForm handleClose={handleClose} />
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}