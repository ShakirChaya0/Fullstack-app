import React from 'react';
import { NavLink } from 'react-router';


// --- Componentes de Íconos SVG ---
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const StaffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ReservationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ProductIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V7a2 2 0 00-2-2h-5l-2-2H6a2 2 0 00-2 2v6m16 0l-2 2m2-2l2 2m-2-2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m0 0l2-2m-2 2l-2-2" />
  </svg>
);

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "green" | "yellow";
  href: string;
};

// --- Datos para las tarjetas de acceso rápido ---
const quickAccessItems: Props[] = [
  { title: "Novedades", description: "Gestiona las nuevas novedades que tenga el restaurante .", icon: <MenuIcon />, color: "blue", href: "Novedades" },
  { title: "Mozos", description: "Gestiona las cuentas de los mozos del restaurante.", icon: <StaffIcon />, color: "green", href: "Mozos" },
  { title: "Mesas", description: "Controla el estado de las mesas, organiza reservas y asigna mozos.", icon: <ReservationsIcon />, color: "yellow", href: "Mesas" },
  { title: "Horarios", description: "Configura los horarios de apertura, cierre y disponibilidad del restaurante.", icon: <ClockIcon />, color: "purple", href: "Horarios" },
  { title: "Productos", description: "Administra el inventario, controla el stock y actualiza precios fácilmente.", icon: <ProductIcon />, color: "blue", href: "Productos" },
  { title: "Datos del Restaurante", description: "Consulta datos esenciales del restaurante", icon: <ReportsIcon />, color: "purple", href: "DatosRestaurantes" }
];

// --- Componente de Tarjeta reutilizable ---
const QuickAccessCard = ({ title, description, icon, color, href }: Props) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `block bg-white p-6 rounded-lg shadow-md duration-200 hover:scale-105 transition-all ease-in-out ${
          isActive ? 'ring-2 ring-blue-500' : ''
        }`
      }
    >
      <div className={`flex items-center justify-center h-16 w-16 rounded-full ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl text-black font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </NavLink>
  );
};

// --- Página Principal del Admin ---
const AdminHomepage = () => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[url('/src/shared/assets/rest.jpg')] bg-cover bg-center bg-no-repeat blur-xs brightness-110"></div>
      <div className="relative z-10 container mx-auto p-6 md:p-10 text-white">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">¡Bienvenido de nuevo, Administrador!</h1>
          <p className="text-lg mt-2">Desde aquí puedes gestionar todos los aspectos de tu restaurante de forma centralizada.</p>
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
                href={item.href}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomepage;
