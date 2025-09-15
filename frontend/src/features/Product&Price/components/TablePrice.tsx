import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { PriceList } from "../interfaces/product&PriceInterfaces";
import DeleteIcon from '@mui/icons-material/Delete';

export function TablePrice({ priceList, onDeletePrice }: { 
    priceList: PriceList[], 
    onDeletePrice: (price: PriceList) => void 
}) {
    const handleOpenPriceDelete = (price: PriceList) => {
        onDeletePrice(price);
        window.dispatchEvent(new CustomEvent('openPriceDeleteModal'));
    }

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
                            <TableCell align="right" sx={{ fontFamily: 'monospace', fontSize: '1rem', display: 'flex'}}>
                                <button 
                                    onClick={() => handleOpenPriceDelete(price)}
                                    className="flex items-center gap-2 bg-red-800 hover:bg-red-600 text-white px-4 py-2 
                                    rounded-lg font-medium transition-colors duration-200 whitespace-nowrap h-[40px]"
                                >
                                    <DeleteIcon/>
                                    Borrar
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}