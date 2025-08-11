import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { Bebida, Comida } from "../interfaces/products";

type Props = {
    key: number,
    product: Comida | Bebida
}

const ProductsCard: React.FC<Props> = ({product}) => {
  return (
    <Box sx={{ minWidth: 200, maxWidth: 680, marginTop: 2, marginBottom: 2 }}>
      <Card variant="outlined">
        <React.Fragment>
            <CardContent>
                <Typography variant="h5" component="div">
                    {product._name}
                </Typography>
                <Typography variant="body2">
                    {product._description}
                </Typography>
                <Typography variant="body2">
                    ${product._price}
                </Typography>
            </CardContent>
        </React.Fragment>
      </Card>
    </Box>
  );
}
export default ProductsCard