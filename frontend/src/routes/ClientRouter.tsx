import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";

// Layouts and Pages
const ClientMainLayout = lazy(() => import("../shared/components/ClientMainLayout"));
const Menu = lazy(() => import("../features/Products/pages/Menu"));
const DrinksList = lazy(() => import("../features/Products/pages/DrinksList"));
const FoodsList = lazy(() => import("../features/Products/pages/FoodsList"));
const ConfirmOrder = lazy(() => import("../features/Products/pages/ConfirmOrder"));
const UserProfile = lazy(() => import("../features/Profile/pages/UserProfile"));
const ReservationPage = lazy(() => import("../features/Reservation/pages/ReservationCRUD"));
const ReservationHistorial = lazy(() => import("../features/Reservation/pages/ReservationList"));
const FinishedOrder = lazy(() => import("../features/Products/pages/FinishedOrder"));
const ProtectedRoute = lazy(() => import("../shared/components/ProtectedRoute"));
const CheckPage = lazy(() => import("../features/Payment/pages/CheckPage"));
const SuccessfulPaymentPage = lazy(() => import("../features/Payment/pages/SuccessfulPaymentPage"));
const PendingPaymentPage = lazy(() => import("../features/Payment/pages/PendingPaymentPage"));
const FailurePaymentPage = lazy(() => import("../features/Payment/pages/FailurePaymentPage"));
const ClientHomePage = lazy(() => import("../shared/components/ClienteHomePage"));
const ReservationFormSkeleton = lazy(() => import("../features/Reservation/pages/SkeletonReservationClient"));
const ModifyOrder = lazy(() => import("../features/Order/pages/modifyOrder"));

// Skeletons
const ProfileCardSkeleton = lazy(() => import("../features/Profile/components/ProfileCardSkeleton"));
const CheckSkeleton = lazy(() => import("../features/Payment/pages/CheckSkeleton"));
const PaymentStatusSkeleton = lazy(() => import("../features/Payment/pages/PaymentStatusSkeleton"));
const MenuSkeleton = lazy(() => import("../features/Products/pages/MenuSkeleton"));
const OrderSkeleton = lazy(() => import("../features/Products/pages/OrderSkeleton"));


export default function ClientRouter() {
  return (
    <Routes>

      <Route element={<ClientMainLayout />}>

        <Route path="/" element={
            <ClientHomePage/>
        }/>

        <Route path="/Menu" element={
          <Suspense fallback={<MenuSkeleton />}>
            <Menu />
          </Suspense>
        } />

        <Route path="/Menu/Comidas" element={
            <FoodsList />
        } />

        <Route path="/Menu/Bebidas" element={
            <DrinksList />
        } />

        <Route path="/Menu/RealizarPedido" element={
          <Suspense fallback={<OrderSkeleton />}>
            <ConfirmOrder/>
          </Suspense>
        }/>

        <Route path="/Menu/ModificarPedido" element={
          <Suspense fallback={<OrderSkeleton />}>
            <ModifyOrder/>
          </Suspense>
        }/>

        <Route path="/Menu/PedidoConfirmado" element={
          <Suspense fallback={<OrderSkeleton />}>
            <FinishedOrder/>
          </Suspense>
        }/>

        <Route path="/Reserva" element={
          <Suspense fallback={<ReservationFormSkeleton />}>
            <ProtectedRoute userType={"Cliente"}>
              <ReservationPage />
            </ProtectedRoute>
          </Suspense>
        }/>

        <Route path="/Reserva/Historial" element={
            <ProtectedRoute userType={"Cliente"}>
              <ReservationHistorial />
            </ProtectedRoute>
        }/>

        <Route path="/Perfil" element={
          <Suspense fallback={<ProfileCardSkeleton/>}>
            <ProtectedRoute userType={"Cliente"}>
              <UserProfile />
            </ProtectedRoute>
          </Suspense>
        }/>

        <Route path="/Pedido/Cuenta/:idPedido" element={
          <Suspense fallback={<CheckSkeleton />}>
            <CheckPage />
          </Suspense>
        }/>

        <Route path="/Pedido/Pago/Exito" element={
          <Suspense fallback={<PaymentStatusSkeleton />}>
            <SuccessfulPaymentPage />
          </Suspense>
        }/>

        <Route path="/Pedido/Pago/Pendiente" element={
          <Suspense fallback={<PaymentStatusSkeleton />}>
            <PendingPaymentPage />
          </Suspense>
        }/>

        <Route path="/Pedido/Pago/Fallo" element={
          <Suspense fallback={<PaymentStatusSkeleton />}>
            <FailurePaymentPage />
          </Suspense>
        }/>

      </Route>

    </Routes>
  );
}