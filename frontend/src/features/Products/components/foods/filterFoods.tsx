import { Box, TextField } from "@mui/material"
import FilterIconsFoods from "./filterIconsFoods"

type Props = {
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FilterFoods: React.FC<Props> = ({handleChange}) => {
    return(
        <form className="flex flex-col items-center md:p-4 space-y-4 sticky top-0 bg-white z-50">
            <Box sx={{ width: 500, maxWidth: '100%'}}>
                <TextField fullWidth label="Ingrese el nombre del Producto" id="fullWidth" onChange={handleChange}/>
            </Box>
            <FilterIconsFoods/>
        </form>
    )
}

export default FilterFoods