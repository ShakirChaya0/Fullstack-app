import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { useSuggestions } from "../hooks/useSuggestions"
import "swiper/css"
import "swiper/css/navigation"
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useOrderActions } from "../../../shared/hooks/useOrderActions"
import { useAppSelector } from "../../../shared/hooks/store"
import SuggestionSkeleton from "./SuggestionSkeleton"

export default function SuggestionsList() {
  const { isError, isLoading, data } = useSuggestions()
  const { handleAddToCart, hanldeRemoveFromCart } = useOrderActions()
  const order = useAppSelector((state) => state.order)

  const uniqueSuggestions = Array.from(
    new Map(data?.map((s) => [s._product._name, s])).values()
  ) 

  const handleAdd = (lp: {nombreProducto: string, descripcion: string, precio: number}) => {
    handleAddToCart({nombreProducto: lp.nombreProducto, descripcion: lp.descripcion, precio: lp.precio})
  }

  const handleRemove = (name: string) => {
    hanldeRemoveFromCart({nombreProducto: name})
  }
  

  return (
    <>
      {
        !isLoading ? (
          <>
            <h1 className="max-w-4xl mx-auto text-black text-2xl">SUGERENCIAS</h1>
            {
              !isError ? (
                <div className="min-h-[260px] flex items-center justify-center py-4 w-full relative">
                  <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={20}        
                    slidesPerView={1}    
                    loop={true}    
                    breakpoints={{
                      1000: { slidesPerView: 2 },
                      1500: { slidesPerView: 3 }
                    }}
                    className="px-8"
                  >
                    {uniqueSuggestions?.map((s) => {
                      const cantidad = order.lineasPedido?.find((lp) => lp.nombreProducto === s._product._name)?.cantidad ?? 0
                      return(
                        <SwiperSlide key={s._product._description} className="px-8">
                          <div
                            className="
                              border border-orange-500 min-h-[200px] flex-shrink-0 
                              flex flex-col bg-white rounded-xl shadow-md justify-evenly
                              transition-all ease-in-out py-4 px-2 
                            "
                          >
                            <h1 className="self-center lg:text-2xl">{s._product._name}</h1>
                            <p className="self-center md:text-md">{s._product._description}</p>
                            <p className="self-center text-orange-500 md:text-md">${s._product._price}</p>
                            <div className="self-center border rounded-md 
                              transition-all duration-200 bg-orange-500
                              text-white font-medium flex flex-row justify-around 
                              items-center gap-1 w-fit">
                              <button onClick={() => handleAdd({nombreProducto: s._product._name, descripcion: s._product._description, precio: s._product._price})} 
                                className={`cursor-pointer h-full 
                                w-full py-1.5 px-2 bg-orange-500 hover:scale-105
                                 hover:bg-orange-600 transition-all ease-linear duration-150
                                  active:bg-orange-700 active:scale-100 ${cantidad === 0 ? "rounded-md" : "rounded-l-md"}`}>
                                <ControlPointIcon/>
                              </button>
                              {
                                cantidad > 0 &&
                                <>
                                  <p>{cantidad}</p>
                                  <button onClick={() => handleRemove(s._product._name)} 
                                    className={`cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 
                                    hover:scale-105 hover:bg-orange-600 transition-all ease-linear duration-150 
                                    active:bg-orange-700 active:scale-100 ${cantidad === 0 ? "rounded-md" : "rounded-r-md"}`}>

                                    <RemoveCircleOutlineIcon/>
                                  </button>
                                </>
                              }
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>
                </div>
              ) : (<p>Error</p>)
            }
          </>
        ) : (<SuggestionSkeleton/>)
      }
    </>
  )
}