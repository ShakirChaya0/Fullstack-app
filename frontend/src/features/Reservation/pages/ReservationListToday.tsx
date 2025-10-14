import type { IReservation } from '../interfaces/IReservation';
import { ReservationCard } from '../components/ReservationCardWaiter';
import { useReservations } from '../hooks/useReservation';
import { useEffect, useState } from 'react';
import { hoy } from '../constants/constants';
import { Autocomplete, TextField } from '@mui/material';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function ReservationsView() {
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    status,
    error,
  } = useReservations(4, 'today');

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  if (status === 'pending') {
      return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">Cargando reservas</h2>
              <p className="text-sm text-gray-500 mt-1">Obteniendo las reservas de hoy...</p>
            </div>
          </div>
        </div>
      );
    }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-red-50 to-gray-100 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-l-4 border-red-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 rounded-full p-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Error al cargar</h2>
          </div>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar las reservas. Por favor, verifica tu conexión e intenta nuevamente.
          </p>
          <div className="bg-gray-50 rounded-md p-3 mb-4">
            <p className="text-sm text-gray-500 font-mono">{error.message}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const allReservations: IReservation[] = data.pages.flatMap((page) => page.data);
  
  const filteredReservations = allReservations.filter((res) => {
    if (res._status !== 'Cancelada' && res._status !== 'No_Asistida') {
      const fullName = `${res._clientPublicInfo.nombre} ${res._clientPublicInfo.apellido}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    }
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 w-full">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6 border-b pb-2">
        Reservas de Hoy - {hoy}
      </h1>

      <div className="mb-6 w-full">
        <Autocomplete
          freeSolo
          options={[]}
          value={searchTerm}
          onInputChange={(event, newValue) => setSearchTerm(newValue)}
          renderInput={(params) => (
            <TextField
              sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 16, // redondeado
            backgroundColor: '#f9fafb', // gris claro como fondo
            paddingRight: 1,
            '&:hover fieldset': {
              borderColor: '#f59e0b', // borde ámbar al hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#f59e0b', // borde ámbar al focus
              boxShadow: '0 0 0 2px rgba(245,158,11,0.2)', // glow suave
            },
          },
          '& .MuiInputLabel-root': {
            color: '#374151', // gris oscuro label
            fontWeight: 500,
          },
          '& .MuiInputBase-input': {
            padding: '12px 14px', // más padding
            fontSize: '0.95rem',
            color: '#1f2937', // texto gris oscuro
          },
        }}
              {...params}
              label="Buscar por cliente"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>

      <div className="space-y-4">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation._reserveId}
              reservation={{ ...reservation }}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
            No se encontraron reservas con "{searchTerm}".
          </div>
        )}
      </div>

      <div className="flex justify-center py-8">
        {isFetchingNextPage ? (
          <div className="text-indigo-600 font-semibold">
            Cargando más reservas...
          </div>
        ) : hasNextPage ? (
          <button
            className="cursor-pointer px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out active:scale-95 disabled:opacity-50"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            Cargar más reservas
          </button>
        ) : filteredReservations.length > 0 ? (
          <p className="text-gray-500">Fin de todas las reservas de hoy.</p>
        ) : null}
      </div>
    </div>
  );
}
