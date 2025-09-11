import { Stack, Avatar, Typography } from "@mui/material";
import { orange } from "@mui/material/colors";
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import KebabDiningIcon from '@mui/icons-material/KebabDining';

export default function FilterIconsDrinks() {
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      sx={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        display: "flex",
        overflowX: { xs: "auto", sm: "visible" }, 
        flexWrap: { xs: "nowrap", sm: "wrap" },  
        "&::-webkit-scrollbar": { display: "none" }, 
        scrollbarWidth: "none",
      }}
    >
      <Stack
          direction="column"
          alignItems="center"
          spacing={1}
          sx={{
            flex: { xs: "0 0 auto", sm: "1 0 calc(100% / 6)" }, 
            minWidth: 100,
            textAlign: "center",
            px: 1,
          }}>
        <a href="#Alcoholicas" style={{ width: "100%", cursor: "default" }}>
          <Avatar sx={{
                bgcolor: orange[700],
                cursor: "pointer",
                width: 56,
                height: 56,
                margin: "0 auto",
              }}>
            <KebabDiningIcon fontSize='small'/>
          </Avatar>
        </a>
        <Typography variant="body2" noWrap>Alcoholicas</Typography>
      </Stack>

      <Stack
          direction="column"
          alignItems="center"
          spacing={1}
          sx={{
            flex: { xs: "0 0 auto", sm: "1 0 calc(100% / 6)" }, 
            minWidth: 100,
            textAlign: "center",
            px: 1,
          }}
        >
        <a href="#No_Alcoholicas" style={{ width: "100%", cursor: "default" }}>
          <Avatar sx={{
                bgcolor: orange[700],
                cursor: "pointer",
                width: 56,
                height: 56,
                margin: "0 auto",
              }}>
            <LocalDiningIcon fontSize='small'/>
          </Avatar>
        </a>
        <Typography variant="body2" noWrap>No Alcoholicas</Typography>
      </Stack>
    </Stack>
  );
}
