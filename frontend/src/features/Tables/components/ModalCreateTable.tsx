import { Box, Modal, Typography, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

interface IModalCreateTable {
  open: boolean; 
  onClose: () => void;
  onSave: (data: { capacity: number }) => void;
}

export function ModalCreateTable({ open, onClose, onSave }: IModalCreateTable) {
  const [capacity, setCapacity] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleConfirm = () => {
    if (!capacity || isNaN(capacity)) {
      setError("La capacidad debe ser un número.");
      return;
    }
    if (capacity < 1 || capacity > 10) {
      setError("La capacidad debe estar entre 1 y 10.");
      return;
    }
    onSave({ capacity });
    handleClose();
  }

  const handleClose = () => {
    setCapacity(0); 
    setError("");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
      <Box
        sx={{
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          outline: 'none',
        }}
      >
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ textAlign: 'center', mb: 2 }}
        >
          Nueva mesa
        </Typography>

        <TextField
          label="Capacidad"
          variant="outlined"
          fullWidth
          type="number"
          inputProps={{ min: 1, max: 10 }}
          value={capacity}
          onChange={(e) => {
            setCapacity(Number(e.target.value));
            if (error) setError("");
          }}
          error={Boolean(error)}
          helperText={error || "Ingrese un número entre 1 y 10"}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <button
            onClick={handleClose}
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-500 text-black hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="cursor-pointer px-4 py-2 rounded-lg border border-amber-600 text-black hover:bg-amber-600 transition"
          >
            Crear
          </button>
        </Box>
      </Box>
    </Modal>
  );
}
