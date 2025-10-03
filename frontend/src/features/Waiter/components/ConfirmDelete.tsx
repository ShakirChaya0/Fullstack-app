import * as React from "react";
import type { Waiter } from "../interfaces/Waiters";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmDeleteProps {
  open: boolean;
  onClose: () => void;
  handleDeleteMozo: (id: string) => void;
  Waiter: Waiter;
}

export default function ConfirmDelete({
  open,
  onClose,
  handleDeleteMozo,
  Waiter,
}: ConfirmDeleteProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "rgba(0, 0, 0, 0.1)" },
        },
      }}
    >
      <DialogTitle id="confirm-delete-title">
        Eliminar Novedad {Waiter.email}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="confirm-delete-description">
          ¿Está seguro que desea eliminar esta novedad? Esta acción no se puede
          deshacer.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Volver
        </Button>
        <Button
          onClick={() => handleDeleteMozo(Waiter?.idMozo ?? '')}
          color="error"
          variant="contained"
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}