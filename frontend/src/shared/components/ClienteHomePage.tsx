import React from 'react';
import useAuth from '../hooks/useAuth';
import { NavLink } from 'react-router';
import RestaurantImage from '../utils/assets/RestaurantGreen.jpg';

const ClipboardListIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    {...props}
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
);

const CalendarCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    {...props}
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="M9 16l2 2 4-4" />
  </svg>
);

type Props = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  color: "blue" | "green";
  href: string;
};

// --- Tarjeta de navegación ---
const NavigationCard = ({ icon: Icon, title, description, color, href }: Props) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-500' },
    green: { bg: 'bg-green-100', text: 'text-green-600', hoverBg: 'group-hover:bg-green-500' },
  };
  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `group block p-8 bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
          isActive ? 'ring-2 ring-blue-500' : ''
        }`
      }
    >
      <div className="flex flex-col items-center justify-center">
        <div
          className={`${selectedColor.bg} ${selectedColor.text} p-4 rounded-full mb-4 ${selectedColor.hoverBg} group-hover:text-white transition-colors`}
        >
          <Icon className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        <p className="text-slate-500 mt-1 text-sm">{description}</p>
      </div>
    </NavLink>
  );
};

export default function App() {
  const { user } = useAuth();

  const navigationItems: Props[] = [
    {
      icon: ClipboardListIcon,
      title: "Registrar Reserva",
      description: "Crea nuevas reservas fácilmente y gestiona los detalles de cada pedido.",
      color: "blue",
      href: "../Reserva"
    },
    {
      icon: CalendarCheckIcon,
      title: "Registro de Reservas",
      description: "Consulta y administra todas las reservas existentes en el calendario del salón.",
      color: "green",
      href: "../Reserva/Historial"
    },
  ];

  return (
    <div className="relative w-full flex-1 overflow-hidden bg-black">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xs brightness-110"
        style={{ backgroundImage: `url(${RestaurantImage})` }}
      />
      <div className="relative mx-auto px-4 py-16 sm:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          ¡Hola, {user?.username}!
        </h1>
        <p className="mt-4 text-lg text-white">
          Bienvenida al sistema. Selecciona una opción para comenzar a gestionar.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {navigationItems.map((item, index) => (
            <NavigationCard
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              color={item.color}
              href={item.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
