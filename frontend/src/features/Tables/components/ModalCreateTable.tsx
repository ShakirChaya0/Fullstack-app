import { Box, Modal, Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

type IModalCreateTable = {
    open: boolean; 
    onClose: () => void;
    onSave: (data:{capacity: number}) => void;
}
 const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: 2,  
  boxShadow: 24,
  p: 4
};

export function ModalCreateTable({ open, onClose, onSave }: IModalCreateTable) {
    const [capacity, setCapacity] = useState<number>(0);
    const [error, setError] = useState<string>("");

    const handleConfirm = () => {
         if (!capacity || isNaN(capacity) || capacity <= 0){
            setError('La capacidad debe ser un numero mayor a 0');
            return;
         } 
        onSave({ capacity: capacity }); 
        toast.success('Mesa registrada exitosamente')
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
            className="px-4 py-2 rounded-lg border border-gray-500 text-black hover:bg-gray-300 transition">
                Cancelar
            </button>
            <button 
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg border border-amber-600 text-black hover:bg-amber-600 transition">
                Crear
            </button>
        </div>
      </Box>
    </Modal>
  );
}
