import { Box, Modal, Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { useState } from "react";
import { style } from "../constants/constantes";


interface IModalCreateTable {
    open: boolean; 
    onClose: () => void;
    onSave: (data:{capacity: number}) => void;
}

export function ModalCreateTable({ open, onClose, onSave }: IModalCreateTable) {
    const [capacity, setCapacity] = useState<number>(0);
    const [error, setError] = useState<string>("");

    const handleConfirm = () => {
         if (!capacity || isNaN(capacity) || capacity <= 0){
            setError('La capacidad debe ser un numero mayor a 0');
            return;
         } 
        onSave({ capacity: capacity }); 
        handleClose();
    }

    const handleClose = () => {
        setCapacity(0); 
        setError("");
        onClose();
    }
  return (
    <Modal open= {open} onClose= {onClose} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        <Typography id="modal-modal-title" sx={{textAlign:'center'}} variant="h6" component="h2">
          Nueva mesa
        </Typography>
        <TextField           
            label="Capacidad"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            onChange={(e) => {
                setCapacity(Number(e.target.value));
                if (error) setError("");
            }}
            value={capacity}
            error={Boolean(error)}
            helperText={error}
        > 
        </TextField>
        <div className="flex justify-end gap-2 mt-4">
            <button 
            onClick={handleClose}
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-500 text-black hover:bg-gray-300 transition">
                Cancelar
            </button>
            <button 
            onClick={handleConfirm}
            className="cursor-pointer px-4 py-2 rounded-lg border border-amber-600 text-black hover:bg-amber-600 transition">
                Crear
            </button>
        </div>
      </Box>
    </Modal>
  );
}
