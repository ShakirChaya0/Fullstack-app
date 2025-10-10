import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import { style } from "../constants/constantes";

interface ModalDeleteTable {
    open: boolean;
    numTable: number;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ModalDeleteTable({ open, numTable, loading, onClose, onConfirm }: ModalDeleteTable) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{...style}}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <WarningIcon color="warning" sx={{fontSize: 60 }}></WarningIcon>
        </Box>
        <Typography align="center" variant="h6">
            ¡Atención!
        </Typography>
        <Typography>¿Seguro que querés eliminar la mesa <strong>{numTable}</strong>?</Typography>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} disabled={loading} className="cursor-pointer px-4 py-2 rounded-lg border border-gray-400 text-gray-700 
               hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"  
            > Cancelar
          </button>
          <button onClick={onConfirm} disabled={loading} className="cursor-pointer px-4 py-2 rounded-lg border border-red-600 bg-red-500 text-white 
               hover:bg-red-600 hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50">
            {loading ? <CircularProgress size={20} color="inherit" /> : "Eliminar"}
          </button>
        </div>
      </Box>
    </Modal>
  );
}
