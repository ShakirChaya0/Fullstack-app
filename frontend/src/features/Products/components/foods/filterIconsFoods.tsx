import { Stack, Avatar, Typography, useMediaQuery, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const itemWidth = isSmall ? "calc((100% / 3) - 16px)" : "calc((100% / 6) - 16px)";

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      justifyContent="center"
      sx={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 0,
        marginLeft: "-8px",
        marginRight: "-8px",
      }}
    >
      {items.map(({ href, label, Icon }) => (
        <Stack
          key={label}
          direction="column"
          alignItems="center"
          spacing={1}
          sx={{
            width: itemWidth,
            minWidth: 100,
            textAlign: "center",
            paddingLeft: "8px",
            paddingRight: "8px",
            boxSizing: "border-box",
          }}
        >
          <a href={href} style={{ width: "100%" }}>
            <Avatar
              sx={{
                bgcolor: orange[500],
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
