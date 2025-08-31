import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import type { ITable } from '../interfaces/ITable';


type PropsTable = {
  tables: ITable[];
  onEditar: (numTable: number) => void;
  onEliminar: (numTable: number) => void;
};

export function TableList({ tables, onEditar, onEliminar }: PropsTable) {
  return(  
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Número de Mesa</TableCell>
            <TableCell>Capacidad</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tables.map((table) => (
            <TableRow key={table._numTable}>
              <TableCell>{table._numTable}</TableCell>
              <TableCell>{table._capacity}</TableCell>
              <TableCell>{table._status}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => onEditar(table._numTable)}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => onEliminar(table._numTable)}
                  style={{ marginLeft: "8px" }}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
} 
