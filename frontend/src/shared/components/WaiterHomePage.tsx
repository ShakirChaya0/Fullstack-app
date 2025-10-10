import React from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';

const ReservationsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const StaffTablesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12h18" />
    <path d="M3 18h18" />
    <path d="M3 6h18" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);

const RestaurantTablesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

type Props = {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
    color: "blue" | "purple" | "green" | "yellow";
    link: string;
}

// --- Tarjeta de navegación ---
const QuickAccessCard = ({ icon: Icon, title, description, color, link }: Props) => {
  const navigate = useNavigate();

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      hoverBg: 'group-hover:bg-blue-500',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      hoverBg: 'group-hover:bg-purple-500',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      hoverBg: 'group-hover:bg-green-500',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      hoverBg: 'group-hover:bg-yellow-500',
    },
  };

  const selectedColor = colorClasses[color];

  const handleClick = () => {
    navigate(link);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer block p-8 bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex flex-col items-center justify-center">
        <div
          className={`${selectedColor.bg} ${selectedColor.text} p-4 rounded-full mb-4 ${selectedColor.hoverBg} group-hover:text-white transition-colors`}
        >
          <Icon className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        <p className="text-slate-500 mt-1 text-sm text-center">{description}</p>
      </div>
    </div>
  );
};

export default function WaiterHomepage() {
  const { user } = useAuth();

  const quickAccessItems: Props[] = [
    {
      icon: ReservationsIcon,
      title: "Reservas del dia",
      description: "Consulta las reservas del día y prepárate para recibir a tus clientes con la mejor atención.",
      color: "purple",
      link: "/Mozo/ReservaDelDia"
    },
    {
      icon: StaffTablesIcon,
      title: "Mesas",
      description: "Gestiona las mesas con pedidos",
      color: "green",
      link: "/Mozo/Mesas"
    },
    {
      icon: RestaurantTablesIcon,
      title: "Mesas del Restaurante",
      description: "Controla la disponibilidad de las mesas y organiza las mismas.",
      color: "yellow",
      link: "/mozo/MesasDisponibles"
    },
  ];

  return (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessItems.map((item, index) => (
              <QuickAccessCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                color={item.color}
                link={item.link}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}