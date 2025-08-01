import * as React from 'react';
import { Stack, Avatar, Typography } from "@mui/material";
import { orange } from "@mui/material/colors";
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import KebabDiningIcon from '@mui/icons-material/KebabDining';

export default function FilterIconsDrinks() {
  return (
    <Stack
      direction="row"
      spacing={5}
      justifyContent="center"
      alignItems="center"
      sx={{ width: "100%" }}
    >
      <Stack direction="column" alignItems="center" spacing={1}>
        <a href="#Alcoholicas">
          <Avatar sx={{ bgcolor: orange[500], cursor: "pointer", width: { xs: 40, sm: 56 }, height: { xs: 40, sm: 56 } }}>
            <KebabDiningIcon fontSize='small'/>
          </Avatar>
        </a>
        <Typography variant="body2">Alcoholicas</Typography>
      </Stack>

      <Stack direction="column" alignItems="center" spacing={1}>
        <a href="#No_Alcoholicas">
          <Avatar sx={{ bgcolor: orange[500], cursor: "pointer", width: { xs: 40, sm: 56 }, height: { xs: 40, sm: 56 } }}>
            <LocalDiningIcon fontSize='small'/>
          </Avatar>
        </a>
        <Typography variant="body2">No Alcoholicas</Typography>
      </Stack>
    </Stack>
  );
}
