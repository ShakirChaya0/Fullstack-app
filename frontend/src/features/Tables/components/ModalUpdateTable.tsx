import { useEffect, useState } from "react";
import type { ITable } from "../interfaces/ITable";
import { Box, Modal, Typography } from "@mui/material";
import { TextField } from "@mui/material";

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

type ModalUpdateTable = {
  open: boolean;
  table: ITable;
  onClose: () => void;
  onSave: (numTable: number, data: { capacity: number}) => void;
};

export function ModalUpdateTable ({open, table, onClose, onSave } : ModalUpdateTable){
    const [capacity, setCapacity] = useState<number>(0); 
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (table) {
            setCapacity(table._capacity);
        }
    }, [table]);

  const handleSubmit = () => {
        if (capacity <= 0) {
            setError("La capacidad debe ser mayor a 0"); 
            return;
        }
        onSave(table._tableNum, { capacity })
        onClose();
  }

    return (
        <Modal open= {open} onClose= {onClose} aria-labelledby="modal-modal-title">
              <Box sx={style}>
                <Typography id="modal-modal-title" sx={{textAlign:'center'}} variant="h6" component="h2">
                  Editar la Mesa: {table?._tableNum}
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
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-gray-500 text-black hover:bg-gray-300 transition">
                        Cancelar
                    </button>
                    <button 
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-lg border border-amber-600 text-black hover:bg-amber-600 transition">
                        Modificar                    
                    </button>
                </div>
              </Box>
            </Modal>
    );
}