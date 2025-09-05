import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import type { ITable } from '../interfaces/ITable';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';


type PropsTable = {
  tables: ITable[];
  onEditar: (numTable: number) => void;
  onEliminar: (numTable: number) => void;
};

export function TableList({ tables, onEditar, onEliminar }: PropsTable) {
  console.log(tables)
  return(  
    <>   
    <div className="flex flex-col items-center w-full ml-6 mr-6" >
      <h1 className="text-2xl font-bold mb-4 mt-5">Mesas</h1>
      <TableContainer component={Paper} sx={{
        width: "100%",
        boxShadow: 3,
        borderRadius: 2
       }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx = {{ textAlign:"center", fontWeight:600 }} > Número de Mesa</TableCell>
              <TableCell sx = {{ textAlign:"center", fontWeight:600 }} > Capacidad</TableCell>
              <TableCell sx = {{ textAlign:"center", fontWeight:600 }} > Estado</TableCell>
              <TableCell sx = {{ textAlign:"center", fontWeight:600 }} > Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table._tableNum}>
                <TableCell sx = {{ textAlign:"center" }} > {table._tableNum}</TableCell>
                <TableCell sx = {{ textAlign:"center" }} > {table._capacity}</TableCell>
                <TableCell sx = {{ textAlign:"center" }} > {table._state}</TableCell>
                <TableCell sx = {{ textAlign:"center"}} >
                  <Button
                  sx={{
                    bgcolor:'trasparent', 
                    color: "black", 
                    fontSize: "16px",
                    fontWeight: "24", 
                    border: "2px solid #f0ea00", 
                    textTransform: "none", 
                    transition: "0.3s", 
                    " &:hover": {
                        bgcolor: '#f0ea00',        
                        color: 'black',              
                        boxShadow: 6               
                      }
                  }}
                    onClick={() => onEditar(table._tableNum)}
                    >
                    <EditIcon sx={{mr:0.5}} ></EditIcon>
                    Editar
                  </Button>
                  <Button
                    sx={{
                      bgcolor:'trasparent', 
                      color: "black", 
                      fontSize: "16px",
                      fontWeight: "24", 
                      border: "2px solid #f50d0a", 
                      textTransform: "none", 
                      marginLeft: "10px",
                      transition: "0.3s", 
                      " &:hover": {
                          bgcolor: '#f50d0a',        
                          color: 'white', 
                          fontWeight: "400",             
                          boxShadow: 6               
                        }
                      }}
                    onClick={() => onEliminar(table._tableNum)}
                    >
                    <DeleteIcon sx={{mr:0.5}}></DeleteIcon>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    <Button>Agregar Mesa</Button>
    </>
  )
} 
