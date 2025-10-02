import { TextField } from "@mui/material"
import FilterIconsFoods from "./filterIconsFoods"
import GoBackButton from "../../../../shared/components/GoBackButton"

type Props = {
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FilterFoods: React.FC<Props> = ({handleChange}) => {
    return(
        <form className="flex flex-col items-center md:p-4 space-y-4 sticky top-0 bg-white z-20 
        border-b border-b-gray-700 w-full py-4">
            <div className="flex w-full flex-col-reverse gap-2">
                <TextField 
                    fullWidth 
                    label="Ingrese el nombre del Producto" 
                    id="fullWidth" 
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: 'black',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#4a5565'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            '&.Mui-focused': {
                                color: '#4a5565',
                            }
                        }
                    }}
                    onChange={handleChange}
                />
                <GoBackButton url="/Cliente/Menu"/>
            </div>
            <FilterIconsFoods/>
        </form>
    )
}

export default FilterFoods