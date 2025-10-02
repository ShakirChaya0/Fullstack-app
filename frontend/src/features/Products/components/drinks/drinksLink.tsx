import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router';
import BlackSoda from '../../assets/blackSoda.png';

export default function DrinksLink() {
  return (
    <NavLink to="Bebidas">
        <Card sx={{ minWidth: 275, bgcolor: "orange", maxWidth: 280 }}>
          <CardContent sx={{ height: "100%", padding: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img src={BlackSoda} alt="Icon" className="h-10 w-10 mr-2"/>
            <Typography gutterBottom sx={{ color: "black", fontSize: 16, textAlign: "center", marginTop: '0.5rem' }}>
              Bebidas
            </Typography>
          </CardContent>
        </Card>
    </NavLink>
  );
}