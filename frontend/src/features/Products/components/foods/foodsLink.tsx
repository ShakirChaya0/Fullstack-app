import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router';
import BlackBurger from '../../assets/blackBurger.png'

export default function FoodsLink() {
  return (
    <NavLink to="Comidas">
        <Card sx={{ minWidth: 275, bgcolor: "orange", maxWidth: 280}}>
          <CardContent sx={{ height: "100%", padding: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img src={BlackBurger} alt="Icon" className="h-10 w-10 mr-2"/>
            <Typography gutterBottom sx={{ color: "black", fontSize: 16, textAlign: "center", marginTop: '0.5rem'}}>
              Comidas
            </Typography>
          </CardContent>
        </Card>
    </NavLink>
  );
}