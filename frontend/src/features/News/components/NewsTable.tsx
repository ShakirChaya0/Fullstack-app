import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ModalNews from './ModalNews';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNews } from '../services/deleteNews';
import type { BackResults } from '../interfaces/News';
import { toast } from 'react-toastify';
import { usePage } from '../hooks/usePage';
import updateNews from '../services/updateNews';
import type News from '../interfaces/News';
import { ModalContext } from '../hooks/useModalProvider';
import useApiClient from '../../../shared/hooks/useApiClient';
import DeleteNewsModal from './DeleteNewsModal';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    maxWidth: 370,           
    whiteSpace: 'nowrap',   
    overflow: 'hidden',     
    textOverflow: 'ellipsis',
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


export default function NewsTable ({data, handleResetPage}: {data: BackResults | undefined, handleResetPage: (id: number) => void}) {
  const { currentPage, query, filter } = usePage()
  const queryClient = useQueryClient()
  const { apiCall } = useApiClient()

  const { mutate } = useMutation({
    mutationFn: (id: number) => deleteNews(apiCall, id),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["News", currentPage, query, filter]})

      const previousState = queryClient.getQueryData(["News", currentPage, query, filter])

      queryClient.setQueryData(["News", currentPage, query, filter], (oldData: BackResults) => {
        if (!oldData) return { News: [], totalItems: 0, pages: 0 }

        const filteredWaiters = oldData.News.filter(item => item._newsId !== newData) 
              
        return {
          ...oldData,
          News: filteredWaiters,
          totalItems: oldData.totalItems - 1 
        }
      })

      return { previousState }
    },
    onSuccess: () => {
      const totalItems = data?.totalItems ?? 0;
      const itemsPerPage = 5
      if (currentPage > 1 && (totalItems - 1) <= (currentPage - 1) * itemsPerPage) {
        handleResetPage(currentPage - 1);
      }
      toast.success("La novedad se elimino con exito")
    },
    onError: (err, variables, context) => {
        toast.error("Error al eliminar la novedad")
        if (context?.previousState) queryClient.setQueryData(["News", currentPage, query, filter], context.previousState)
        console.log(err)
      },
    onSettled: async () => {
      await queryClient.invalidateQueries({queryKey: ["News"]})
    }
  });

  const News = data?.News

  const handleDeleteNews = React.useCallback((id: number) => {
    mutate(id)
  }, [mutate])

  return (
    <>
    {
      News?.length !== 0 ? (
        <div className='w-full max-w-[1500px] h-full min-h-[400px]'>
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
                  {
                    News?.map((n) => (
                      <NewsRow key={n._newsId} news={n} handleDeleteNews={handleDeleteNews} />
                    ))
                  }
              </TableBody>
            </Table>
          </TableContainer>
      </div>
      ) : (
      <div className="flex items-center w-full h-full justify-center">
        <h1 className='text-center font-medium'>No hay novedades { filter === "Activas" ? "activas" : "cargadas" }</h1>
      </div>
    )
    }
    </>
  );
}

export function ModalProvider ({children, news, fn, msgs, ButtonName}: {children: React.ReactNode, news?: News, fn: (apiCall: (url: string, options?: RequestInit) => Promise<Response>, data: News) => Promise<News>, msgs: {SuccessMsg: string, ErrorMsg: string}, ButtonName: string}) {
  return(
    <ModalContext.Provider value={{news, fn, msgs, ButtonName}}>
      {children}
    </ModalContext.Provider>
  )
}

const NewsRow = React.memo(function NewsRow({ news, handleDeleteNews }: { news: News, handleDeleteNews: (id: number) => void }) {
  return (
    <StyledTableRow key={news._newsId}>
      <StyledTableCell component="th" scope="row" align="center">{news._newsId}</StyledTableCell>
      <StyledTableCell align="center">{news._title}</StyledTableCell> 
      <StyledTableCell align="center">{news._description}</StyledTableCell>
      <StyledTableCell align="center">{news._startDate.split("T")[0]}</StyledTableCell>
      <StyledTableCell align="center">{news._endDate.split("T")[0]}</StyledTableCell>
      <StyledTableCell align="center" sx={{ display: 'flex', gap: "5px", justifyContent: "center" }}>
        <ModalProvider news={news} fn={updateNews} msgs={{ SuccessMsg: "Novedad modificada con exito", ErrorMsg: "Error al modificar una novedad" }} ButtonName={"Modificar"}>
          <ModalNews/>
        </ModalProvider>
        <DeleteNewsModal handleDeleteNews={handleDeleteNews} News={news}/>  
      </StyledTableCell>
    </StyledTableRow>
  )
});
