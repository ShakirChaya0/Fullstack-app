import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router';

export default function FoodsLink() {
  return (
    <NavLink to="/Menu/Comidas">
        <Card sx={{ minWidth: 275, bgcolor: "orange", maxWidth: 280}}>
          <CardContent sx={{ height: "100%", padding: 3.5}}>
            <Typography gutterBottom sx={{ color: "black", fontSize: 16, textAlign: "center" }}>
              🍔Comidas
            </Typography>
          </CardContent>
        </Card>
    </NavLink>
  );
}