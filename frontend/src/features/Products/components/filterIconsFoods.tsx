import * as React from 'react';
import { Stack, Avatar, Typography } from "@mui/material";
import { orange } from "@mui/material/colors";
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CakeIcon from '@mui/icons-material/Cake';
import KebabDiningIcon from '@mui/icons-material/KebabDining';

export default function FilterIconsFoods() {
  return (
    <Stack
      direction="row"
      spacing={5}
      justifyContent="center"
      alignItems="center"
      sx={{ width: "100%" }}
    >
      <Stack direction="column" alignItems="center" spacing={1}>
        <a href="#Entrada">
          <Avatar sx={{ bgcolor: orange[500], cursor: "pointer", width: { xs: 40, sm: 56 }, height: { xs: 40, sm: 56 } }} >
            <KebabDiningIcon fontSize="small" />
          </Avatar>
        </a>
        <Typography variant="body2" >Entradas</Typography>
      </Stack>

      <Stack direction="column" alignItems="center" spacing={1}>
        <a href="#Plato_Principal">
          <Avatar sx={{ bgcolor: orange[500], cursor: "pointer", width: { xs: 40, sm: 56 }, height: { xs: 40, sm: 56 } }}>
            <LocalDiningIcon fontSize="small"/>
          </Avatar>
        </a>
        <Typography variant="body2">Principal</Typography>
      </Stack>

      <Stack direction="column" alignItems="center" spacing={1}>
        <a href="#Postre">
          <Avatar sx={{ bgcolor: orange[500], cursor: "pointer", width: { xs: 40, sm: 56 }, height: { xs: 40, sm: 56 } }}>
            <CakeIcon fontSize="small"/>
          </Avatar>
        </a>
        <Typography variant="body2">Postres</Typography>
      </Stack>
    </Stack>
  );
}
