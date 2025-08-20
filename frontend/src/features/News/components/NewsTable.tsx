import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { useAppSelector } from '../../../shared/hooks/store';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function NewsTable () {
  const News = useAppSelector(state => state.news)
    return (
      <div className='w-full'>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Titulo</StyledTableCell>
                  <StyledTableCell align="center">Descripcion</StyledTableCell>
                  <StyledTableCell align="center">Fecha De Inicio</StyledTableCell>
                  <StyledTableCell align="center">Fecha Fin</StyledTableCell>
                  <StyledTableCell align="center">Titulo</StyledTableCell>
                  <StyledTableCell align="center">Acciones</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {News?.map((news) => (
                  <StyledTableRow key={news._title}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {news._title}
                    </StyledTableCell>
                    <StyledTableCell align="center">{news._description}</StyledTableCell>
                    <StyledTableCell align="center">{news._startDate}</StyledTableCell>
                    <StyledTableCell align="center">{news._endDate}</StyledTableCell>
                    <StyledTableCell align="center">{news._title}</StyledTableCell> 
                    <StyledTableCell align="center" sx={{display: 'flex', gap: "5px", justifyContent: "center"}}>
                        <Button variant='contained'>
                            Modificar
                        </Button>
                        <Button variant="contained" color="error">
                            Eliminar
                        </Button>   
                        
                    </StyledTableCell> 
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
      </div>
    );
}
