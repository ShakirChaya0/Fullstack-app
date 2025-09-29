import { Skeleton, Stack } from "@mui/material";

export default function ReservationFormSkeleton() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          <Skeleton variant="text" width="60%" />
        </h1>
        <form className="flex flex-col gap-4">
          <Stack spacing={3}>
            {/* Fecha */}
            <Skeleton variant="rectangular" height={56} className="rounded-lg" />
            {/* Hora */}
            <Skeleton variant="rectangular" height={56} className="rounded-lg" />
            {/* Número de comensales */}
            <Skeleton variant="rectangular" height={56} className="rounded-lg" />
            {/* Botón */}
            <Skeleton variant="rectangular" height={48} className="rounded-lg" />
          </Stack>
        </form>
      </div>
    </div>
  );
}

