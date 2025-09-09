import { Stack, Avatar, Typography } from "@mui/material";
import { orange } from "@mui/material/colors";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import CakeIcon from "@mui/icons-material/Cake";
import KebabDiningIcon from "@mui/icons-material/KebabDining";
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import TapasIcon from '@mui/icons-material/Tapas';

const items = [
  { href: "#Entrada", label: "Entradas", Icon: KebabDiningIcon },
  { href: "#Plato_Principal", label: "Principal", Icon: LocalDiningIcon },
  { href: "#Postre", label: "Postres", Icon: CakeIcon },
  { href: "#Vegetariana", label: "Vegetariana", Icon: RamenDiningIcon },
  { href: "#Vegana", label: "Vegana", Icon: RiceBowlIcon },
  { href: "#Celiaca", label: "Celiaca", Icon: TapasIcon },
];

export default function FilterIconsFoods() {
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
      {items.map(({ href, label, Icon }) => (
        <Stack
          key={label}
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
          <a href={href} style={{ width: "100%" }}>
            <Avatar
              sx={{
                bgcolor: orange[700],
                cursor: "pointer",
                width: 56,
                height: 56,
                margin: "0 auto",
              }}
            >
              <Icon fontSize="small" />
            </Avatar>
          </a>
          <Typography variant="body2" noWrap>
            {label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
