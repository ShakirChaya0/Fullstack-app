import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { PriceList } from "../interfaces/product&PriceInterfaces";

export function SkeletonPriceList({priceList}: {priceList: PriceList[]}) {
    return (
        <TableContainer 
            component={Paper} 
            sx={{ 
                maxWidth: '100%'
            }}
        >
            <Table
                sx={{ 
                    width: '100%'
                }} 
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
                            <Skeleton 
                                variant="text" 
                                height={24}
                                sx={{ bgcolor: 'grey.400' }}
                            />
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
                            <Skeleton 
                                variant="text" 
                                height={24}
                                sx={{ bgcolor: 'grey.400' }}
                            />
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
                            <Skeleton 
                                variant="text" 
                                height={24}
                                sx={{ bgcolor: 'grey.400' }}
                            />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {priceList.map(() => (
                        <TableRow>
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
                                    <Skeleton 
                                        variant="text" 
                                        height={24}
                                        sx={{ bgcolor: 'grey.400' }}
                                    />
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
                                <Skeleton 
                                    variant="text" 
                                    height={24}
                                    sx={{ bgcolor: 'grey.400' }}
                                />
                            </TableCell>
                            <TableCell 
                                align="center"
                                sx={{ 
                                    borderBottom: 'none'
                                }}
                            >
                                <Skeleton 
                                    variant="rounded" 
                                    height={30}
                                    sx={{ bgcolor: 'grey.400' }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}