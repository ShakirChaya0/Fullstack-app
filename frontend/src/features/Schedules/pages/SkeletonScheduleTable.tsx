import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export function SkeletonScheduleTable() {

    const skeletonRows = Array.from({ length: 7 }, (_, index) => index);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="skeleton table">
                <TableHead 
                    sx={{
                        bgcolor: "#e9ddc2"
                    }}
                >
                    <TableRow>
                        <TableCell>
                            <Skeleton 
                                variant="text" 
                                width="60%" 
                                height={24}
                                sx={{ bgcolor: 'grey.400' }}
                            />
                        </TableCell>
                        <TableCell align="center">
                            <Skeleton 
                                variant="text" 
                                width="70%" 
                                height={24}
                                sx={{ bgcolor: 'grey.400' }}
                            />
                        </TableCell>
                        <TableCell align="center">
                            <Skeleton 
                                variant="text" 
                                width="70%" 
                                height={24}
                                sx={{ bgcolor: 'grey.400' }}
                            />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {skeletonRows.map((index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">   
                                <Box
                                    sx={{
                                        marginLeft: {sm: "2rem"}
                                    }}
                                >
                                    <Skeleton 
                                        variant="text" 
                                        width="80%" 
                                        height={20}
                                    />
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                <Skeleton 
                                    variant="text" 
                                    width="60%" 
                                    height={20}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Skeleton 
                                    variant="text" 
                                    width="60%" 
                                    height={20}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
