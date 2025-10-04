import { Stack, Avatar, Typography } from "@mui/material";
import { orange } from "@mui/material/colors";
import NoAlcohol from '../../assets/no-alcohol.png'
import Alcohol from '../../assets/beer.png'

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
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.25)",
                },
              }}>
            <img src={Alcohol} alt="gluten free" className="h-10 w-10"/>
          </Avatar>
        </a>
        <Typography variant="body2" noWrap>Alcohólicas</Typography>
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
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.25)",
                },
              }}>
            <img src={NoAlcohol} alt="Icon" className="h-10 w-10"/>
          </Avatar>
        </a>
        <Typography variant="body2" noWrap>No Alcohólicas</Typography>
      </Stack>
    </Stack>
  );
}
