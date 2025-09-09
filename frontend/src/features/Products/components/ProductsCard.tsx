import * as React from 'react';
import type { Bebida, Comida } from "../interfaces/products";
import DefaultProduct from "../assets/product-default.svg"
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useOrderActions } from '../../../shared/hooks/useOrderActions';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useAppSelector } from '../../../shared/hooks/store';

type Props = {
    key: number,
    product: Comida | Bebida
}

const ProductsCard: React.FC<Props> = ({product}) => {
  const order = useAppSelector((state) => state.order)
  const productAmount = order.lineasPedido.find((lp) => lp.nombreProducto === product._name)?.cantidad
  const countStart = productAmount ?? 0
  const { handleAddToCart, hanldeRemoveFromCart} = useOrderActions()
  const handleAdd = () => {
    handleAddToCart({nombreProducto: product._name})
  }
  const handleRemove = () => {
    hanldeRemoveFromCart({nombreProducto: product._name})
  }
  return (
    <div className='min-w-[200px] max-w-[600px] mt-1 mb-1'>
        <div className='py-2 px-4 border border-gray-300 shadow-lg rounded-lg min-h-[150px] flex flex-row justify-between'>
            <div className='flex flex-col justify-evenly'>
              <h1 className='text-xl font-medium'>{product._name}</h1>
              <p>{product._description}</p>
              <p className='text-orange-500 font-bold'>${product._price}</p>
              <div 
              className='
              border group hover:border hover:border-orange-400 py-1.5 px-4 self-start 
              rounded-md hover:bg-white transition-all duration-200 bg-orange-500
            text-white font-medium flex flex-row justify-around items-center gap-4'>
              <button
                onClick={handleAdd}
                className='cursor-pointer'
              >
                <ControlPointIcon className='group-hover:text-orange-500'/>
              </button>
              {
                countStart !== 0 && 
                <>
                  <p className='group-hover:text-orange-500'>{countStart}</p>
                  <button
                    onClick={handleRemove}
                    className='cursor-pointer'
                  >
                    <RemoveCircleOutlineIcon className='group-hover:text-orange-500'/>
                  </button>
                </>
              }
              </div>
            </div>
            <div className='w-full h-full max-w-[82px] max-h-[82px] self-center'>
                <img src={DefaultProduct} alt="" className='w-full h-full'/>
            </div>
        </div>
    </div>

  );
}
export default ProductsCard