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
import ModalUpdateNews from './ModalUpdateNews';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNews } from '../services/deleteNews';
import type { BackResults } from '../interfaces/News';
import { toast } from 'react-toastify';

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


export default function NewsTable ({data, currentPage}: {data: BackResults | undefined, currentPage: number}) {

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: deleteNews,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['News', currentPage] });
      toast.success("La novedad se elimino con exito")
    },
    onError: (err) => {
      toast.error("Error al eliminar la novedad")
      console.log(err)
    }
  });

  const News = data?.News ?? []

  const handleDeleteNews = (id: number) => {
    mutate(id)
  }

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
                <>
                  {
                    News?.map((news) => (
                      <StyledTableRow key={news._newsId}>
                        <StyledTableCell component="th" scope="row" align="center">
                          {news._newsId}
                        </StyledTableCell>
                        <StyledTableCell align="center">{news._title}</StyledTableCell> 
                        <StyledTableCell align="center">{news._description}</StyledTableCell>
                        <StyledTableCell align="center">{news._startDate.split("T")[0]}</StyledTableCell>
                        <StyledTableCell align="center">{news._endDate.split("T")[0]}</StyledTableCell>
                        <StyledTableCell align="center" sx={{display: 'flex', gap: "5px", justifyContent: "center"}}>
                            <ModalUpdateNews news={news} currentPage={currentPage}/>
                            <Button variant="contained" color="error" onClick={() => handleDeleteNews(news._newsId ?? 0)}>
                                Eliminar
                            </Button>   
                    
                        </StyledTableCell> 
                      </StyledTableRow>
                    ))
                  }
                </>
              </TableBody>
            </Table>
          </TableContainer>
      </div>
      ) : (<h1 className='text-center font-medium'>No hay novedades cargadas</h1>)
    }
    </>
  );
}
