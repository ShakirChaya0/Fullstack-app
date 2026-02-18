import { Box, CircularProgress, Modal, Typography, useMediaQuery } from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import { style } from "../constants/constantes";
import { useTheme } from "@mui/material/styles";

interface ModalDeleteTable {
    open: boolean;
    numTable: number;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ModalDeleteTable({ open, numTable, loading, onClose, onConfirm }: ModalDeleteTable) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          ...style,
          width: isMobile ? '90%' : '400px',
          maxWidth: '95%',
          p: isMobile ? 3 : 4,
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <WarningIcon color="warning" sx={{ fontSize: isMobile ? 50 : 60 }} />
        </Box>

        <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600 }}>
          ¡Atención!
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
          ¿Seguro que querés eliminar la mesa <strong>{numTable}</strong>?
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'flex-end', gap: 2 }}>
          <button
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-400 text-gray-700
                       hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="cursor-pointer px-4 py-2 rounded-lg border border-red-600 bg-red-500 text-white
                       hover:bg-red-600 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Eliminar"}
          </button>
        </Box>
      </Box>
    </Modal>
  );
}
