import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { useSuggestions, type BackSuggestion } from "../hooks/useSuggestions"
import "swiper/css"
import "swiper/css/navigation"
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useOrderActions } from "../../../shared/hooks/useOrderActions"
import { useAppSelector } from "../../../shared/hooks/store"
import SuggestionSkeleton from "./SuggestionSkeleton"
import { useCallback } from "react"
import type { Bebida, Comida } from "../interfaces/products"

export default function SuggestionsList() {
  const { isError, isLoading, data } = useSuggestions()
  const { handleAddToCart, hanldeRemoveFromCart } = useOrderActions()

  const uniqueSuggestions = Array.from(
    new Map(data?.map((s) => [s._product._name, s])).values()
  ) 

  const handleAdd = useCallback((prod: Comida | Bebida) => {
    handleAddToCart(prod)
  }, [handleAddToCart])

  const handleRemove = useCallback((name: string) => {
    hanldeRemoveFromCart({nombreProducto: name})
  }, [hanldeRemoveFromCart])
  

  return (
    <>
      {
        !isLoading ? (
          uniqueSuggestions.length > 0 ? (
            <>
              <h1 className="w-full text-center font-semibold text-black text-2xl">SUGERENCIAS</h1>
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
                      {uniqueSuggestions?.map((s) => (
                        <SwiperSlide key={s._product._description} className="px-8">
                          <SuggestionCard s={s} handleAdd={handleAdd} handleRemove={handleRemove}/>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ) : (<p>Error</p>)
              }
            </>
            ) : (null)
        ) : (<SuggestionSkeleton/>)
      }
    </>

  )
}

function SuggestionCard ({s, handleAdd, handleRemove}: {s: BackSuggestion, handleAdd: (prod: Comida | Bebida) => void, handleRemove: (name: string) => void}) {
  const order = useAppSelector((state) => state.order)
  const lp = order.lineasPedido.find((lp) => lp.producto._name === s._product._name)
  const cantidad = lp?.cantidad ?? 0
  return (
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
        {
          cantidad > 0 &&
          <>
            <button onClick={() => handleRemove(s._product._name)} 
              className={`cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 
                hover:scale-105 hover:bg-orange-600 transition-all ease-linear duration-150 
                active:bg-orange-700 active:scale-100 ${cantidad === 0 ? "rounded-md" : "rounded-l-md"}`}>
              <RemoveCircleOutlineIcon/>
            </button>
            <p>{cantidad}</p>
          </>
        }
        <button onClick={() => handleAdd(s._product)} 
          className={`cursor-pointer h-full 
          w-full py-1.5 px-2 bg-orange-500 hover:scale-105
           hover:bg-orange-600 transition-all ease-linear duration-150
            active:bg-orange-700 active:scale-100 ${cantidad === 0 ? "rounded-md" : "rounded-r-md"}`}>
          <ControlPointIcon/>
        </button>
      </div>
    </div>
  )
}