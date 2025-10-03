// src/components/ReservationsView.tsx
import { useState } from 'react';
import type { IReservation, StateReservation } from '../interfaces/IReservation';
import ReservationCard from '../components/ReservationCardWaiter';

// Datos de MOCK para la vista previa (normalmente vendrían de useReservations)
const MOCK_RESERVATIONS: IReservation[] = [
  {
    _reserveId: 101, _reserveDate: new Date(), _reserveTime: '20:00', _cancelationDate: null, _commensalsNumber: 4, _status: 'Realizada', 
    _clientPublicInfo: { nombre: 'Juan', apellido: 'Pérez', telefono: '123456789' }, _table: [{
      _tableNum: 5, _capacity: 1,
      _state: 'Libre'
    }]
  },
  {
    _reserveId: 102, _reserveDate: new Date(), _reserveTime: '20:30', _cancelationDate: null, _commensalsNumber: 2, _status: 'Asistida', 
    _clientPublicInfo: { nombre: 'María', apellido: 'Gómez', telefono: '987654321' }, _table: [{ _tableNum: 12, _capacity: 4 , _state:"Ocupda"}]
  },
  {
    _reserveId: 103, _reserveDate: new Date(), _reserveTime: '21:00', _cancelationDate: null, _commensalsNumber: 6, _status: 'No_Asistida', 
    _clientPublicInfo: { nombre: 'Carlos', apellido: 'Rodríguez', telefono: '112233445' }, _table: [{ _tableNum: 8, _capacity: 4 , _state:"Ocupda" }, { _tableNum: 9, _capacity: 4 , _state:"Ocupda" }]
  },
  {
    _reserveId: 104, _reserveDate: new Date(), _reserveTime: '19:45', _cancelationDate: new Date(), _commensalsNumber: 3, _status: 'Cancelada', 
    _clientPublicInfo: { nombre: 'Laura', apellido: 'Martínez', telefono: '001122334' }, _table: [{ _tableNum: 3, _capacity: 4 , _state:"Ocupda" }]
  },
];

export function ReservationsView() {
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de filtrado simple para la simulación
  const filteredReservations = MOCK_RESERVATIONS.filter(res => {
    const fullName = `${res._clientPublicInfo.nombre} ${res._clientPublicInfo.apellido}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 w-full">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">Reservas de Hoy 📅</h1>

      {/* Barra de Búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido del cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-gray-700"
        />
      </div>

      {/* Lista de Reservas */}
      <div className="space-y-4">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            // Clonamos la reserva para que cada tarjeta tenga su propio estado inicial
            <ReservationCard key={reservation._reserveId} reservation={{...reservation}} /> 
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
            No se encontraron reservas con "{searchTerm}".
          </div>
        )}
      </div>

      {/* Simulación de Carga Infinita */}
      <div className="flex justify-center py-8">
        <button
          className="cursor-pointer px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out"
          onClick={() => console.log('Simulando cargar más páginas...')}
        >
          Cargar más reservas...
        </button>
      </div>
    </div>
  );
};

export default ReservationsView;