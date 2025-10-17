import type { UniqueProfileData } from "../types/ProfileSharedTypes";

export type FieldConfig = {
    name: keyof UniqueProfileData | string;
    label: string;
    rules?: any;
    type?: string;
    show: (profile: UniqueProfileData) => boolean;
    component?: "controller" | "input";
};

export function getFieldConfigs(): FieldConfig[] {
    return [
        {
            name: "nombre",
            label: "Nombre",
            rules: {
                required: "El nombre es obligatorio",
                validate: (value: string) =>
                    value.trim().length > 0 || "No puede contener solo espacios",
                minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
            },
            show: (p) => "nombre" in p,
        },
        {
            name: "apellido",
            label: "Apellido",
            rules: {
                required: "El apellido es obligatorio",
                validate: (value: string) =>
                    value.trim().length > 0 || "No puede contener solo espacios",
                minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
            },
            show: (p) => "apellido" in p,
        },
        {
            name: "dni",
            label: "DNI",
            rules: {
                required: "El DNI es obligatorio",
                validate: (value: string) => {
                    if (value.trim().length === 0)
                        return "No puede contener solo espacios";
                    return /^\d{8}$/.test(value) || "Formato de DNI inválido (Ej: 12345678)";
                },
            },
            show: (p) => "dni" in p,
        },
        {
            name: "telefono",
            label: "Teléfono",
            rules: {
                required: "El teléfono es obligatorio",
                validate: (value: string) => {
                    if (value.trim().length === 0)
                        return "No puede contener solo espacios";
                    return (
                        /^\+?\d{5,15}$/.test(value) ||
                        "Formato de Teléfono inválido (Ej: 123456789, +541123456789)"
                    );
                },
            },
            show: (p) => "telefono" in p,
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            rules: {
                required: "El Email es obligatorio",
                validate: (value: string) => {
                    if (value.trim().length === 0)
                        return "No puede contener solo espacios";
                    return (
                        /\S+@\S+\.\S+/.test(value) ||
                        "Formato de Email inválido (Ej: tucorreo@ejemplo.com)"
                    );
                },
            },
            show: (p) => "email" in p,
        },
        {
            name: "fechaNacimiento",
            label: "Fecha Nacimiento",
            type: "date",
            rules: {
                required: "La fecha de nacimiento es obligatoria",
            },
            show: (p) => "fechaNacimiento" in p,
            component: "input",
        },
        {
            name: "nombreUsuario",
            label: "Usuario",
            rules: {
                required: "El Nombre de Usuario es obligatorio",
                validate: (value: string) =>
                    value.trim().length > 0 || "No puede contener solo espacios",
                minLength: { value: 4, message: "Debe tener al menos 4 caracteres" },
            },
            show: () => true,
        },
    ];
}
