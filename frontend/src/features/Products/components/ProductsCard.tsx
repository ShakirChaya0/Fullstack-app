import * as React from 'react';
import type { Bebida, Comida } from "../interfaces/products";
import DefaultProduct from "../assets/product-default.svg"
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useOrderActions } from '../../../shared/hooks/useOrderActions';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useAppSelector } from '../../../shared/hooks/store';

type Props = {
    product: Comida | Bebida
}

const DefaultProductImg = (
  <img src={DefaultProduct} alt="" className="w-full h-full" />
)

const ProductsCard: React.FC<Props> = ({product}) => {
  const order = useAppSelector((state) => state.order)
  const pendingProduct = order.lineasPedido
    .filter(lp => lp.estado === 'Pendiente')
    .find(lp => lp.producto._name === product._name)
  const countStart = pendingProduct?.cantidad ?? 0
  const { handleAddToCart, hanldeRemoveFromCart} = useOrderActions()
  const handleAdd = () => {
    handleAddToCart(product)
  }
  const handleRemove = () => {
    hanldeRemoveFromCart({nombreProducto: product._name})
  }
  
  return (
    <div className='min-w-[200px] max-w-[600px] mt-1 mb-1'>
        <div 
          className='
          py-2 px-4 border border-gray-300 shadow-lg hover:shadow-2xl duration-300 ease-in-out
          rounded-lg min-h-[150px] flex flex-row justify-between transition-shadow
        '>

            <div className='flex flex-col justify-evenly'>
              <h1 className='text-xl font-medium'>{product._name}</h1>
              <p>{product._description}</p>
              <p className='text-orange-500 font-bold'>${product._price}</p>
              <div 
              className='
              self-start border rounded-md 
              transition-all duration-200 bg-orange-500
              text-white font-medium flex flex-row justify-around 
              items-center gap-1 w-fit'>
              {
                countStart !== 0 && 
                <>
                  <button
                    onClick={handleRemove}
                    className='cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 hover:scale-105
                    hover:bg-orange-600 rounded-l-md transition-all ease-linear duration-150
                    active:bg-orange-700 active:scale-100'
                    >
                    <RemoveCircleOutlineIcon/>
                  </button>
                  <p>{countStart}</p>
                </>
              }
              <button
                onClick={handleAdd}
                className={`cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 hover:scale-105 hover:bg-orange-600 transition-all ease-linear duration-150 active:bg-orange-700 active:scale-100 ${countStart === 0 ? "rounded-md" : "rounded-r-md"}`}
              >
                <ControlPointIcon/>
              </button>
            </div>
        </div>
            <div className='w-full h-full max-w-[82px] max-h-[82px] self-center'>
                {DefaultProductImg}
            </div>
        </div>
    </div>

  );
}
export default ProductsCard