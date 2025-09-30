import { Box, TextField } from "@mui/material"
import FilterIconsDrinks from "./filterIconsDrinks"

type Props = {
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FilterDrinks: React.FC<Props> = ({handleChange}) => {
    return(
        <form className="flex flex-col items-center space-y-4 z-20">
            <Box sx={{ width: 500, maxWidth: '100%'}}>
                <TextField fullWidth label="Ingrese el nombre del Producto" id="fullWidth" onChange={handleChange}/>
            </Box>
            <FilterIconsDrinks/>
        </form>
    )
}

export default FilterDrinks