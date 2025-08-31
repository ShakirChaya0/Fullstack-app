import { TableList } from "../components/MesasTable"
import { useTables } from "../hooks/useTable"



export function TableCRUD () {
    
    const { tables, loading, error } = useTables(); 

    
        if (loading) return <p>Cargando...</p>;
        console.log(tables)
        if (error) return <p>Error: {error}</p>;
    
    return (
        <TableList 
            tables={tables}
            onEditar={(numTable) => console.log("Editar mesa", numTable)} 
            onEliminar={(numTable) => console.log("Eliminar mesa", numTable)} >
        </TableList>
    )
}