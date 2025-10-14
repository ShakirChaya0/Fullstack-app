import { Skeleton } from "@mui/material";

export default function MenuSkeleton() {
  return (
    <div className="flex flex-1 flex-col justify-center items-center gap-5 p-4">
      
      {/* Skeleton para el componente FoodsLink */}
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={150} 
        sx={{ borderRadius: 2, maxWidth: 400 }} 
      />

      {/* Skeleton para el componente DrinksLink */}
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={150} 
        sx={{ borderRadius: 2, maxWidth: 400 }} 
      />

    </div>
  );
}