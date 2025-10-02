import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
const Menu = lazy(() => import("../features/Products/pages/Menu"))
import { ClientMainLayout } from "../shared/components/ClientMainLayout";
const DrinksList = lazy(() => import("../features/Products/pages/DrinksList"))
const FoodsList = lazy(() => import("../features/Products/pages/FoodsList"))
const ConfirmOrder = lazy(() => import("../features/Products/pages/ConfirmOrder"))
const ProfileCardSkeleton = lazy(() => import("../features/Profile/components/ProfileCardSkeleton"));
const UserProfile = lazy(() => import("../features/Profile/pages/UserProfile"));
import  ReservationCRUD  from "../features/Reservation/pages/ReservationCRUD";
import ReservationHistorial from "../features/Reservation/pages/ReservationList";
const CheckPage = lazy(() => import("../features/Payment/pages/CheckPage"));
const CheckSkeleton = lazy(() => import("../features/Payment/pages/CheckSkeleton"));
const SuccessfulPaymentPage = lazy(() => import("../features/Payment/pages/SuccessfulPaymentPage"));
const PendingPaymentPage = lazy(() => import("../features/Payment/pages/PendingPaymentPage"));
const FailurePaymentPage = lazy(() => import("../features/Payment/pages/FailurePaymentPage"));
const PaymentStatusSkeleton = lazy(() => import("../features/Payment/pages/PaymentStatusSkeleton"));

export function ClientRouter() {
  return (
    <Routes>
      <Route element={<ClientMainLayout />}>
        <Route path="/"></Route>
        <Route path="/Menu" element={<Menu />} />
        <Route path="/Menu/Comidas" element={<FoodsList />} />
        <Route path="/Menu/Bebidas" element={<DrinksList />} />
        <Route path="/Reserva" element={<ReservationCRUD/>}/>
        <Route path="/Reserva/Historial" element={<ReservationHistorial/>}></Route>
        <Route path="/Menu/RealizarPedido" element={<ConfirmOrder/>}/>
        <Route path="/Perfil" element={
          <Suspense fallback = {<ProfileCardSkeleton/>}>
            <UserProfile />
          </Suspense>
        }/>
        <Route path="/Pedido/Cuenta" element={
          <Suspense fallback = {<CheckSkeleton />}>
            <CheckPage />
          </Suspense>
        }/>
        <Route path="/Pedido/Pago/Exito" element={
          <Suspense fallback = {<PaymentStatusSkeleton />}>
            <SuccessfulPaymentPage />
          </Suspense>
        }/>
        <Route path="/Pedido/Pago/Pendiente" element={
          <Suspense fallback = {<PaymentStatusSkeleton />}>
            <PendingPaymentPage />
          </Suspense>
        }/>
        <Route path="/Pedido/Pago/Fallo" element={
          <Suspense fallback = {<PaymentStatusSkeleton />}>
            <FailurePaymentPage />
          </Suspense>
        }/>
      </Route>
    </Routes>
  )
}

