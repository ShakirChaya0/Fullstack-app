import type News from "../interfaces/News";
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
  handleDeleteNews: (id: number) => void;
  News: News;
}

export default function ConfirmDelete({
  open,
  onClose,
  handleDeleteNews,
  News,
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
        Eliminar Novedad {News._newsId}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="confirm-delete-description">
          ¿Está seguro que desea eliminar esta novedad? Esta acción no se puede
          deshacer.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit" variant="outlined" sx={{textTransform: "none"}}>
          Volver
        </Button>
        <Button
          onClick={() => {handleDeleteNews(News._newsId ?? 0); onClose()}}
          color="error"
          variant="contained"
          sx={{textTransform: "none"}}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}