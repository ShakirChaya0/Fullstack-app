import React from 'react';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import useAuth from '../hooks/useAuth';

const ReservationsIcon = () => (
  <CalendarMonthIcon className="h-8 w-8" />
);

const StaffTablesIcon = () => (
  <RoomServiceIcon className="h-8 w-8" />
);

const RestaurantTablesIcon = () => (
  <TableRestaurantIcon className="h-8 w-8" />
);

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "green" | "yellow";
};

// --- Datos para las tarjetas de acceso rápido ---
const quickAccessItems: Props[] = [
    {
      title: "Reservas del dia",
      description: "Consulta las reservas del día y prepárate para recibir a tus clientes con la mejor atención.",
      icon: <ReservationsIcon />,
      color: "purple"
    },
  {
    title: "Mesas",
    description: "Gestiona las mesas con pedidos",
    icon: <StaffTablesIcon />,
    color: "green"
  },
  {
    title: "Mesas del Resaturante",
    description: "Controla la disponibilidad de las mesas y organiza las mismas.",
    icon: <RestaurantTablesIcon />,
    color: "yellow"
  },
];

const QuickAccessCard = ({ title, description, icon, color }: Props) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md duration-200 cursor-pointer hover:scale-105 transition-all ease-in-out">
            <div className={`flex items-center justify-center h-16 w-16 rounded-full ${colorClasses[color]} mb-4`}>
                {icon}
            </div>
            <h3 className="text-xl text-black font-bold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default function WaiterHomepage() {

    const { user } = useAuth();

    return (
        <>
            <div className="relative w-full h-full overflow-hidden bg-black">
                <div className="absolute inset-0 bg-[url('/src/shared/assets/rest.jpg')] bg-cover bg-center bg-no-repeat blur-xs brightness-110"></div>
                <div className="relative z-10 container mx-auto p-6 md:p-10 text-white">
                  <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold">
                      ¡Bienvenido de nuevo, {user?.username}!
                    </h1>
                    <p className="text-lg mt-2">
                      Gestiona tus mesas y reservas del día para brindar una atención rápida, eficiente y con la mejor experiencia para tus clientes.
                    </p>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Accesos Rápidos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {quickAccessItems.map((item, index) => (
                        <QuickAccessCard
                          key={index}
                          title={item.title}
                          description={item.description}
                          icon={item.icon}
                          color={item.color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
            </div>
        </>
    );
};
