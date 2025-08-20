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
import { useNewsActions } from '../hooks/useNewsActions';
import ModalUpdateNews from './ModalUpdateNews';

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
  const { handleDeleteNews } = useNewsActions()
    return (
      <>
      {
        News.length !== 0 ? (
          <div className='w-full'>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Id</StyledTableCell>
                    <StyledTableCell align="center">Titulo</StyledTableCell>
                    <StyledTableCell align="center">Descripcion</StyledTableCell>
                    <StyledTableCell align="center">Fecha De Inicio</StyledTableCell>
                    <StyledTableCell align="center">Fecha Fin</StyledTableCell>
                    <StyledTableCell align="center">Acciones</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {News?.map((news) => (
                    <StyledTableRow key={news._title}>
                      <StyledTableCell component="th" scope="row" align="center">
                        {news._newsId}
                      </StyledTableCell>
                      <StyledTableCell align="center">{news._title}</StyledTableCell> 
                      <StyledTableCell align="center">{news._description}</StyledTableCell>
                      <StyledTableCell align="center">{news._startDate.split("T")[0]}</StyledTableCell>
                      <StyledTableCell align="center">{news._endDate.split("T")[0]}</StyledTableCell>
                      <StyledTableCell align="center" sx={{display: 'flex', gap: "5px", justifyContent: "center"}}>
                          <ModalUpdateNews news={news}/>
                          <Button variant="contained" color="error" onClick={() => handleDeleteNews(news._newsId)}>
                              Eliminar
                          </Button>   

                      </StyledTableCell> 
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </div>
        ) : (<h1 className='text-center font-medium'>No hay novedades cargadas</h1>)
      }
      </>
    );
}
