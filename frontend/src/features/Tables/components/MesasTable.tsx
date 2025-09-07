import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ITable } from '../interfaces/ITable';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

type TableList = {
  tables: ITable[];
  onUpdate: (Table: ITable) => void;
  onDelete: (numTable: number) => void;
  onAdd: () => void;
};

export function TableList({ tables, onUpdate, onDelete , onAdd}: TableList) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // detecta mobile

  return(  
    <>   
      <h1 className="text-2xl font-bold mb-4 mt-5">Mesas</h1>
      <TableContainer component={Paper} sx={{ width: "100%", boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign:"center", fontWeight:600 }}>Número de Mesa</TableCell>
              <TableCell sx={{ textAlign:"center", fontWeight:600 }}>Capacidad</TableCell>
              <TableCell sx={{ textAlign:"center", fontWeight:600 }}>Estado</TableCell>
              <TableCell sx={{ textAlign:"center", fontWeight:600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table._tableNum}>
                <TableCell sx={{ textAlign:"center" }}>{table._tableNum}</TableCell>
                <TableCell sx={{ textAlign:"center" }}>{table._capacity}</TableCell>
                <TableCell sx={{ textAlign:"center" }}>{table._state}</TableCell>
                <TableCell sx={{ textAlign:"center"}} >
                  <Box display="flex" justifyContent="center" gap={1} >
                      <Button
                        sx={{
                          bgcolor:'transparent', 
                          color: "black", 
                          fontSize: "16px",
                          fontWeight: 24, 
                          border: "2px solid #f0ea00", 
                          textTransform: "none", 
                          transition: "0.3s", 
                          "&:hover": {
                            bgcolor: '#f0ea00',        
                            color: 'black',              
                            boxShadow: 6               
                          }
                        }}
                        onClick={() => onUpdate(table)}
                        startIcon={!isMobile ? <EditIcon /> : undefined}
                      >
                        {!isMobile ? "Editar" : <EditIcon />}
                      </Button>
                      <Button
                        sx={{
                          bgcolor:'transparent', 
                          color: "black", 
                          fontSize: "16px",
                          fontWeight: 24, 
                          border: "2px solid #f50d0a", 
                          textTransform: "none", 
                          marginLeft: "10px",
                          transition: "0.3s", 
                          "&:hover": {
                            bgcolor: '#f50d0a',        
                            color: 'white', 
                            fontWeight: 400,             
                            boxShadow: 6               
                          }
                        }}
                        onClick={() => onDelete(table._tableNum)}
                        startIcon={!isMobile ? <DeleteIcon /> : undefined}
                        >
                        {!isMobile ? "Eliminar" : <DeleteIcon />}
                      </Button>
                    </Box>
                </TableCell> 
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button 
        variant="contained"
        sx={{
          mt: 3, 
          bgcolor: "transparent", 
          fontSize: "16px", 
          textTransform: "none",
          color: "black", 
          border: "2px solid #ffb300", 
          paddingX: 3,
          transition: "0.3s", 
          "&:hover": {
            bgcolor: "#ffb300", 
            boxShadow: 6
          }
        }}
        onClick={onAdd}
        startIcon={!isMobile ? <AddIcon /> : undefined}
      >
        {!isMobile ? "Agregar Mesa" : <AddIcon />}
      </Button>
    </>
  )
}
