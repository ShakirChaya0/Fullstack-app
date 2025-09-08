import { Skeleton } from "@mui/material";

export default function SkeletonInstitution() {
    return(
        <section className="flex-1 flex flex-col items-center justify-center w-full p-4">
            <div className="flex flex-col w-full max-w-7xl h-full">
                <Skeleton
                    sx={{ bgcolor: 'grey.700', height: "100%", borderRadius: 8 }}
                    variant="rectangular"
                />
            </div>
        </section>
    )
}

/* Skeleton más detallado (opcional)

export default function SkeletonForm() {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-lg bg-white w-full max-w-4xl animate-pulse">
      <h2 className="col-span-full text-xl font-bold text-center mb-4">
        <Skeleton variant="text" width={250} sx={{ bgcolor: 'grey.700' }} />
      </h2>

      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <Skeleton variant="text" height={20} width="50%" sx={{ bgcolor: 'grey.700' }} />
          <Skeleton variant="rectangular" height={40} sx={{ bgcolor: 'grey.800', borderRadius: 8 }} />
        </div>
      ))}

      <div className="col-span-full mt-4">
        <Skeleton variant="rectangular" height={50} sx={{ bgcolor: 'grey.900', borderRadius: 12 }} />
      </div>
    </form>
  );
}

*/