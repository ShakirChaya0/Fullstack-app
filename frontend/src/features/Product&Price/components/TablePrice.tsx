import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { PriceList, TablePriceProps } from "../interfaces/product&PriceInterfaces";
import DeleteIcon from '@mui/icons-material/Delete';

export function TablePrice({ priceList, onDeletePrice }: TablePriceProps) {
    const handleOpenPriceDelete = (price: PriceList) => {
        onDeletePrice(price);
        window.dispatchEvent(new CustomEvent('openPriceDeleteModal'));
    }

    return (
        <TableContainer 
            component={Paper} 
            sx={{ 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                overflow: 'auto', 
                maxWidth: '100%'
            }}
        >
            <Table 
                sx={{ 
                    width: '100%'
                }} 
                aria-label="price table"
            >
                <TableHead
                    sx={{
                        bgcolor: "#f8fafc",
                        borderBottom: "2px solid #e2e8f0"
                    }}
                >
                    <TableRow>
                        <TableCell 
                            sx={{ 
                                fontWeight: "700", 
                                fontSize: "1rem",
                                color: "#334155",
                                py: 3,
                                borderBottom: "none"
                            }}
                        >
                            Fecha Vigencia
                        </TableCell>
                        <TableCell 
                            align="center" 
                            sx={{ 
                                fontWeight: "700", 
                                fontSize: "1rem",
                                color: "#334155",
                                py: 3,
                                borderBottom: "none"
                            }}
                        >
                            Monto unitario
                        </TableCell>
                        <TableCell 
                            align="center" 
                            sx={{ 
                                fontWeight: "700", 
                                fontSize: "1rem",
                                color: "#334155",
                                py: 3,
                                borderBottom: "none"
                            }}
                        >
                            Acciones
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {priceList.map((price) => (
                        <TableRow 
                            key={price.fechaVigencia}
                        >
                            <TableCell 
                                component="th" 
                                scope="row"
                                sx={{
                                    color: '#475569',
                                    fontWeight: '500',
                                    fontSize: '0.95rem',
                                    borderBottom: 'none',
                                }}
                            >   
                                <p className="ml-4">
                                    {price.fechaVigencia.slice(0,10)}
                                </p>
                            </TableCell>
                            <TableCell 
                                align="center" 
                                sx={{ 
                                    fontFamily: 'monospace', 
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    color: '#0891b2',
                                    borderBottom: 'none'
                                }}
                            >
                                ${price.monto.toLocaleString()}
                            </TableCell>
                            <TableCell 
                                align="center"
                                sx={{ 
                                    borderBottom: 'none'
                                }}
                            >
                                <button 
                                    onClick={() => handleOpenPriceDelete(price)}
                                    className="inline-flex gap-2 bg-red-50 border border-red-200 
                                    hover:bg-red-100 hover:border-red-300 text-red-700 hover:text-red-800 px-4 py-2 
                                    rounded-lg font-medium transition-all duration-200 whitespace-nowrap h-[36px] 
                                    hover:cursor-pointer hover:shadow-sm"
                                >
                                    <DeleteIcon fontSize="small"/>
                                    <span className="text-sm">Eliminar</span>
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}