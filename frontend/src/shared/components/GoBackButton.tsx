import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

export default function GoBackButton({ url }: { url: string}) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(url)
    }

    return (
        <div
            className="flex justify-end my-3"
        >
            <button
                type='button'
                onClick={handleClick}
                className="
                    flex items-center gap-2 rounded-xl px-5 py-2.5
                    text-sm font-semibold text-white
                    flex-row-reverse md:flex-row
                    bg-gradient-to-r from-orange-500 to-orange-400
                    shadow-lg shadow-orange-500/30 
                    hover:from-orange-600 hover:to-orange-500
                    hover:shadow-orange-600/40
                    active:scale-95 cursor-pointer 
                    transition-all duration-300 ease-in-out
                "
            >
            <ArrowBackIcon
                className='self-center' 
                sx={{ 
                    fontSize: "1.2rem",
                    flexShrink: 0
                }} 
            />
                Volver al menú
            </button>
      </div>
    )
}
