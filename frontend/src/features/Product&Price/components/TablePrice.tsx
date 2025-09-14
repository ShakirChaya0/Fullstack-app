import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { PriceList } from "../interfaces/product&PriceInterfaces";

export function TablePrice({ priceList }: { priceList: PriceList[] }) {

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead
                    sx={{
                        bgcolor: "#e9ddc2"
                    }}
                >
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "large" }}>Fecha Vigencia</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Monto unitario</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}></TableCell>                                            </TableRow>
                </TableHead>
                <TableBody>
                    {priceList.map((price) => (
                        <TableRow key={price.fechaVigencia}>
                            <TableCell component="th" scope="row">   
                            <Box
                                sx={{
                                    marginLeft: {sm: "2rem"}
                                }}
                            >
                                {price.fechaVigencia.slice(0,10)}
                            </Box>
                            </TableCell>
                            <TableCell align="center" sx={{ fontFamily: 'monospace', fontSize: '1rem' }}>${price.monto}</TableCell>
                            <TableCell align="center" sx={{ fontFamily: 'monospace', fontSize: '1rem' }}>
                                <Button>
                                    Borrar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}