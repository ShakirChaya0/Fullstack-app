import React from "react";
import { NavLink } from "react-router";
import RestaurantImage from "../utils/assets/RestaurantGreen.jpg";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import GroupIcon from "@mui/icons-material/Group";
import TableBarIcon from "@mui/icons-material/TableBar";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";

type Props = {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: "blue" | "purple" | "green" | "yellow";
    href: string;
};

// --- Datos para las tarjetas de acceso rápido ---
const quickAccessItems: Props[] = [
    {
        title: "Novedades",
        description:
            "Gestiona, administra y consulta las novedades del restaurante.",
        icon: <NewspaperIcon sx={{ fontSize: 36 }} />,
        color: "blue",
        href: "Novedades",
    },
    {
        title: "Mozos",
        description: "Gestiona las cuentas de los mozos del restaurante.",
        icon: <GroupIcon sx={{ fontSize: 36 }} />,
        color: "green",
        href: "Mozos",
    },
    {
        title: "Mesas",
        description:
            "Consulta, crea, modifica o elimina mesas del restaurante.",
        icon: <TableBarIcon sx={{ fontSize: 36 }} />,
        color: "yellow",
        href: "Mesas",
    },
    {
        title: "Horarios",
        description:
            "Configura los horarios de apertura, cierre y disponibilidad del restaurante.",
        icon: <ScheduleIcon sx={{ fontSize: 36 }} />,
        color: "purple",
        href: "Horarios",
    },
    {
        title: "Productos",
        description: "Administra el inventario y actualiza precios fácilmente.",
        icon: <FastfoodIcon sx={{ fontSize: 36 }} />,
        color: "blue",
        href: "Productos",
    },
    {
        title: "Datos del Restaurante",
        description: "Consulta datos esenciales del restaurante.",
        icon: <SignalCellularAltIcon sx={{ fontSize: 36 }} />,
        color: "purple",
        href: "DatosRestaurantes",
    },
];

// --- Componente de Tarjeta reutilizable ---
const QuickAccessCard = ({ title, description, icon, color, href }: Props) => {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        yellow: "bg-yellow-100 text-yellow-600",
        purple: "bg-purple-100 text-purple-600",
    };

    return (
        <NavLink
            to={href}
            className={({ isActive }) =>
                `block bg-white p-6 rounded-lg shadow-md duration-200 hover:scale-105 transition-all ease-in-out ${
                    isActive ? "ring-2 ring-blue-500" : ""
                }`
            }
        >
            <div
                className={`flex items-center justify-center h-16 w-16 rounded-full ${colorClasses[color]} mb-4`}
            >
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
        <div className="relative w-full min-h-full overflow-hidden bg-black">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xs brightness-110"
                style={{ backgroundImage: `url(${RestaurantImage})` }}
            />
            <div className="relative z-10 container mx-auto p-6 md:p-10 text-white">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        ¡Bienvenido de nuevo, Administrador!
                    </h1>
                    <p className="text-lg mt-2">
                        Desde aquí puedes gestionar todos los aspectos de tu
                        restaurante de forma centralizada.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-6">
                        Accesos Rápidos
                    </h2>
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
