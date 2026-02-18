import { Skeleton } from "@mui/material";

export default function OrderSkeleton() {
  return (
    <section className="p-4 flex flex-col w-full items-center justify-center">
      {/* Contenedor principal del pedido (Simula el cuadrado principal) */}
      <div className="md:border flex flex-col justify-between py-4 md:border-gray-300 md:shadow-2xl min-h-[500px] w-full max-w-3xl md:rounded-2xl">
        
        {/* Encabezado: Título y Total */}
        <div className="flex flex-row justify-between mx-5 mb-3">
          {/* Título */}
          <Skeleton variant="text" sx={{ fontSize: '2rem', width: '150px' }} />
          {/* Total */}
          <div className="flex items-center">
            <Skeleton variant="text" sx={{ fontSize: '2rem', width: '100px' }} />
            <Skeleton variant="text" sx={{ fontSize: '2rem', width: '80px', ml: 1 }} />
          </div>
        </div>

        {/* ZONA SIMPLIFICADA: Un gran rectángulo gris para la lista de productos */}
        <div className="flex-grow p-4 mx-4 md:p-6 md:mx-auto w-full">
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={300} 
              sx={{ borderRadius: 2 }} 
            />
        </div>
      </div>
    </section>
  );
}