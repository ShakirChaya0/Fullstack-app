import { useState } from "react"
import { QRCodeSVG } from 'qrcode.react'
import { Backdrop, CircularProgress, Fade, Modal } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import createQR from "../services/createQR"
import useApiClient from "../../../shared/hooks/useApiClient"

export default function ModalQR({tableNum} : {tableNum: number}){
    const [open, setOpen] = useState(false)
    const [qrToken, setQrToken] = useState<null | string>(null)
    const { apiCall } = useApiClient()

    const handleOpen = () => { 
        setOpen(true)
        mutate()
    }

    const handleClose = () => setOpen(false)

    const { mutate, isPending } = useMutation({
        mutationFn: () => createQR(apiCall, tableNum),
        onSuccess(data) {
            setQrToken(data)
        },
    })
    
    return (
            <div className="mt-6">
                <button
                    onClick={handleOpen}
                    className="w-full bg-blue-600 py-4 text-white rounded-lg cursor-pointer hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all duration-100 ease-in-out"
                    >
                    Generar QR
                </button>
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
                            {!isPending && (
                                    <QRCodeSVG
                                        value={`${import.meta.env.VITE_FRONTEND_URL}/Cliente/Menu?qrToken=${qrToken}&mesa=${tableNum}`}
                                        size={260}
                                        level="H"
                                    />
                                )}
                            {isPending && (
                                <CircularProgress/>
                            )} 
                        </div>
                    </Fade>
                </Modal>
            </div>
    )
}   