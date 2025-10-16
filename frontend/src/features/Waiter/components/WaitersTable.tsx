import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import type { BackResults, Waiter } from '../interfaces/Waiters';
import { ModalContext } from '../hooks/useModalProvider';
import updateWaiter from '../services/updateWaiter';
import ModalWaiters from './ModalWaiters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteWaiter from '../services/deleteWaiter';
import { usePage } from '../hooks/usePage';
import { toast } from 'react-toastify';
import DeleteWaiterModal from './DeleteWaiterModal';
import useApiClient from '../../../shared/hooks/useApiClient';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    maxWidth: 500,           
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


export default function WaitersTable ({waiters, handleResetPage}: {waiters: BackResults | undefined, handleResetPage: (page: number) => void}) {
    const queryClient = useQueryClient()
    const { currentPage, query } = usePage()
    const { apiCall } = useApiClient()


    const { mutate } = useMutation({
        mutationFn: (id: string) => deleteWaiter(apiCall, id),
        onMutate: async (idToDelete) => {
          await queryClient.cancelQueries({ queryKey: ["Waiters", currentPage, query]})
    
          const previousState = queryClient.getQueryData(["Waiters", currentPage, query])

          queryClient.setQueryData(["Waiters", currentPage, query], (oldData: BackResults) => {
            if (!oldData) return { Waiters: [], totalItems: 0, pages: 0 }
    
            const filteredWaiters = oldData.Waiters.filter(item => item.idMozo !== idToDelete) 
                  
            return {
              ...oldData,
              Waiters: filteredWaiters,
              totalItems: oldData.totalItems - 1 
            }
          })
    
          return { previousState }
        },
        onSuccess: () => {
            const totalItems = waiters?.totalItems ?? 0;
            const itemsPerPage = 5;

            if (currentPage > 1 && (totalItems - 1) <= (currentPage - 1) * itemsPerPage) {
              handleResetPage(currentPage - 1);
            }
            toast.success("El mozo se eliminó con éxito")
        },
        onError: (err, variables, context) => {
            toast.error("Error al eliminar al mozo")
            if (context?.previousState) queryClient.setQueryData(["Waiters", currentPage, query], context.previousState)
            console.log(err)
          },
        onSettled: async () => {
          await queryClient.invalidateQueries({queryKey: ["Waiters"]})
        }
      });
    

    const handleDeleteWaiter = React.useCallback((id: string) => {
        mutate(id)
    }, [mutate])

    return (
      <>
      {
        waiters?.Waiters?.length !== 0 ? (
          <div className='w-full max-w-[1500px] h-full min-h-[400px]'>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Nombre de Usuario</StyledTableCell>
                    <StyledTableCell align="center">Nombre</StyledTableCell>
                    <StyledTableCell align="center">Apellido</StyledTableCell>
                    <StyledTableCell align="center">telefono</StyledTableCell>
                    <StyledTableCell align="center">Acciones</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {
                      waiters?.Waiters?.map((w) => (
                        <WaitersRow key={w.email} waiters={w} handleDeleteWaiter={handleDeleteWaiter}/>
                      ))
                    }
                </TableBody>
              </Table>
            </TableContainer>
        </div>
        ) : (
        <div className='flex items-center justify-center w-full h-full'>
          <h1 className='font-medium'>No hay mozos cargados</h1>
        </div>
      )
      }
      </>
    );
}   

export function ModalProvider ({children, waiters, fn, msgs, ButtonName}: {children: React.ReactNode, waiters?: Waiter, fn: (apiCall: (url: string, options?: RequestInit) => Promise<Response>, data: Waiter) => Promise<Waiter>, msgs: {SuccessMsg: string, ErrorMsg: string}, ButtonName: string}) {
  return(
    <ModalContext.Provider value={{waiters, fn, msgs, ButtonName}}>
      {children}
    </ModalContext.Provider>
  )
}

const WaitersRow = React.memo(function WaitersRow({ waiters, handleDeleteWaiter }: { waiters: Waiter, handleDeleteWaiter: (id: string) => void }) {
  return (
    <StyledTableRow key={waiters.idMozo}>
      <StyledTableCell align="center">{waiters.nombreUsuario}</StyledTableCell>
      <StyledTableCell align="center">{waiters.nombre}</StyledTableCell> 
      <StyledTableCell align="center">{waiters.apellido}</StyledTableCell>
      <StyledTableCell align="center">{waiters.telefono}</StyledTableCell>
      <StyledTableCell align="center" sx={{ display: 'flex', gap: "5px", justifyContent: "center" }}>
        <ModalProvider fn={updateWaiter} waiters={waiters} msgs={{SuccessMsg: "Mozo modificado con éxito", ErrorMsg: "Error al modificar el mozo"}} ButtonName='Modificar'>
            <ModalWaiters/>
        </ModalProvider>
        <DeleteWaiterModal handleDeleteMozo={handleDeleteWaiter} Waiter={waiters}/>    
      </StyledTableCell>
    </StyledTableRow>
  )
});
