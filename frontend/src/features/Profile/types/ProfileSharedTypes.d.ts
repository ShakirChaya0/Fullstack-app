export type UserType = "Administrador" | "Cliente" | "Mozo" | "SectorCocina";
export type ProfileData = Admin & Client & Kitchen & Waiter;
export type UniqueProfileData = Admin | Client | Kitchen | Waiter;
