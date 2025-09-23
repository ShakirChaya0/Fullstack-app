import { Skeleton } from "@mui/material";
import type { ProductPrice } from "../interfaces/product&PriceInterfaces";

export function SkelentonProductCards({filteredProducts}: {filteredProducts: ProductPrice[]}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-5">
            {filteredProducts.map(() => (
                <div className="flex flex-col justify-between min-w-auto min-h-auto px-4 py-4 rounded-x"
                >
                    <Skeleton 
                        variant="rounded" 
                        height={200}
                        sx={{ bgcolor: 'grey.400' }}
                    />
                </div>
            ))}
        </div>
    )
}