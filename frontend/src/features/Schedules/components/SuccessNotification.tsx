import Snackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState, useEffect } from 'react';

export function SuccessNotification({ activation }: { activation: boolean }) {
  const [open, setOpen] = useState(activation);

  // useEffect para sincronizar con la prop activation
  useEffect(() => {
    setOpen(activation);
  }, [activation]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Horarios registrados exitosamente!
        </Alert>
      </Snackbar>
    </div>
  );
}