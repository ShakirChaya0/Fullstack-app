import { useCallback, useState } from 'react';
import { Modal, Fade, Backdrop } from '@mui/material';
import SuggestionForm from './SuggestionForm';
import type { Suggestion } from '../interfaces/Suggestion';

export default function ModalUpdateSuggestions({ suggestion }: { suggestion: Suggestion }) {
    const [open, setOpen] = useState(false);
    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), [])

    return (
        <div>
            <button onClick={handleOpen} className="bg-amber-600 cursor-pointer text-white font-semibold py-2 px-5 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors duration-200">
                Modificar
            </button>            
            <Modal
                aria-labelledby="Modificar Sugerencia"
                aria-describedby="Formulario para modificar la sugerencia"
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
                        <SuggestionForm handleClose={handleClose} suggestion={suggestion} />
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}