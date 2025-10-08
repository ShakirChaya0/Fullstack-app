import { Route, Routes } from "react-router";
import { Menu } from "../features/Products/pages/Menu";
import { ClientMainLayout } from "../shared/components/ClientMainLayout";
import DrinksList from "../features/Products/pages/DrinksList";
import FoodsList from "../features/Products/pages/FoodsList";
import { Suspense } from "react";
import ProfileCardSkeleton from "../features/Profile/components/ProfileCardSkeleton";
import UserProfile from "../features/Profile/pages/UserProfile";
import  ReservationCRUD  from "../features/Reservation/pages/ReservationCRUD";
import ReservationHistorial from "../features/Reservation/pages/ReservationList";
import { ReservationFormSkeleton } from "../features/Reservation/pages/SkeletonReservationClient";

export function ClientRouter() {
  return (
    <Routes>
      <Route element={<ClientMainLayout />}>
        <Route path="/"></Route>
        <Route path="/Menu" element={<Menu />} />
        <Route path="/Menu/Comidas" element={<FoodsList />} />
        <Route path="/Menu/Bebidas" element={<DrinksList />} />
        <Route path="/Reserva" element={
          <Suspense fallback = {<ReservationFormSkeleton />}>
              <ReservationCRUD />
          </Suspense>
        }/>
        <Route path="/Reserva/Historial" element={<ReservationHistorial/>}></Route>
        <Route path="/Perfil" element={
          <Suspense fallback = {<ProfileCardSkeleton/>}>
            <UserProfile />
          </Suspense>
        }/>
      </Route>
    </Routes>
  )
}

