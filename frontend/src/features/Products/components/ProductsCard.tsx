import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { Bebida, Comida } from "../interfaces/products";

type Props = {
    key: number,
    food: Comida | Bebida
}

const ProductsCard: React.FC<Props> = ({food}) => {
  return (
    <Box sx={{ minWidth: 200, maxWidth: 680, marginTop: 2, marginBottom: 2 }}>
      <Card variant="outlined">
        <React.Fragment>
            <CardContent>
                <Typography variant="h5" component="div">
                    {food._name}
                </Typography>
                <Typography variant="body2">
                    {food._description}
                </Typography>
            </CardContent>
        </React.Fragment>
      </Card>
    </Box>
  );
}
export default ProductsCard