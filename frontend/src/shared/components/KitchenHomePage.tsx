import React from 'react';
import useAuth from '../hooks/useAuth';
import { NavLink } from 'react-router';

// --- Iconos personalizados ---
const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a6 6 0 0 0-6 6c0 2.5 1.5 4 3 5v3h6v-3c1.5-1 3-2.5 3-5a6 6 0 0 0-6-6z" />
  </svg>
);

const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

// --- Props de cada tarjeta ---
type Props = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  color: "blue" | "green";
  href: string;
};

// --- Componente tarjeta de navegación ---
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

// --- Página principal Cocina ---
export default function KitchenHomePage() {
  const { user } = useAuth();

  const navigationItems: Props[] = [
    {
      icon: LightbulbIcon,
      title: "Sugerencias",
      description: "Visualiza y gestiona las sugerencias de platos y mejoras propuestas por el equipo.",
      color: "blue",
      href: "../Sugerencias"
    },
    {
      icon: ShoppingCartIcon,
      title: "Pedidos",
      description: "Consulta, organiza y gestiona los pedidos activos en la cocina en tiempo real.",
      color: "green",
      href: "../Pedidos"
    },
  ];

  return (
    <div className="relative w-full flex-1 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[url('/src/shared/assets/rest.jpg')] bg-cover bg-center bg-no-repeat blur-xs brightness-110"></div>
      <div className="relative mx-auto px-4 py-16 sm:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          ¡Hola, {user?.username}!
        </h1>
        <p className="mt-4 text-lg text-white">
          Bienvenido al sistema de cocina. Selecciona una opción para comenzar a gestionar.
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
