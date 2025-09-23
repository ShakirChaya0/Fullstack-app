import type { Client } from "../../Login/interfaces/Client";
import type { Waiter } from "../../Waiter/interfaces/Waiters";
import type { Admin } from "../interfaces/Admin";
import type { Kitchen } from "../interfaces/Kitchen";

export type UserType = "Administrador" | "Cliente" | "Mozo" | "SectorCocina";
export type ProfileData = Admin & Client & Kitchen & Waiter;
export type UniqueProfileData = Admin | Client | Kitchen | Waiter;
