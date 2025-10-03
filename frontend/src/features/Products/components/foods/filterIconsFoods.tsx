import { Stack, Avatar, Typography } from "@mui/material"
import { orange } from "@mui/material/colors"
import GlutenFree from '../../assets/gluten-free.png'
import Vegan from '../../assets/vegan.png'
import Vegetarian from '../../assets/vegetarian.png'
import Cutlery from '../../assets/cutlery.png'
import Fries from '../../assets/fires.png'
import IceCream from '../../assets/ice-cream.png'


const items = [
  { href: "#Entrada", label: "Entradas", Icon: Cutlery },
  { href: "#Plato_Principal", label: "Principal", Icon: Fries },
  { href: "#Postre", label: "Postres", Icon: IceCream },
  { href: "#Vegetariana", label: "Vegetariana", Icon: Vegetarian },
  { href: "#Vegana", label: "Vegana", Icon: Vegan },
  { href: "#Celiaca", label: "Celiaca", Icon: GlutenFree }
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
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.25)",
                },
              }}
            >
              <img src={Icon} alt="Icono" className="h-10 w-10"/>
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
