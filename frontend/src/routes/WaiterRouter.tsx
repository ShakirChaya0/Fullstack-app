import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";

// Layouts and Pages
const ReservationsView = lazy(() => import("../features/Reservation/pages/ReservationListToday"));
const CreateOrder = lazy(() => import("../features/Tables/pages/CreateOrder"));
const ShowWaiterTables = lazy(() => import("../features/Tables/pages/ShowWaiterTables"))
const AvailableTable = lazy (() => import("../features/Tables/pages/AvailableTable"));
const WaiterMainLayout = lazy(() => import("../shared/components/WaiterMainLayout"));
const WaiterHomepage = lazy(() => import("../shared/components/WaiterHomePage"));
const UserProfile = lazy(() => import("../features/Profile/pages/UserProfile"));

// Skeletons
const ProfileCardSkeleton = lazy(() => import("../features/Profile/components/ProfileCardSkeleton"));
const SkeletonCreateOrder = lazy(() => import("../features/Tables/pages/CreateOrderSkeletonBody"))

export default function WaiterRouter() {
    return (
        <Routes>

            <Route element={<WaiterMainLayout />}>

                <Route path="/" element={<WaiterHomepage />} />

                <Route path="/ReservaDelDia/" element={<ReservationsView />} />
                
                <Route path="/Mesas/" element={<ShowWaiterTables/>}/>

                <Route path="/CargarPedido/:nroMesa" element={
                    <Suspense fallback={<SkeletonCreateOrder/>}>
                        <CreateOrder/>
                    </Suspense>
                }/>

                <Route path="/MesasDisponibles" element={<AvailableTable />} />

                <Route path="/Perfil" element={
                  <Suspense fallback = {<ProfileCardSkeleton />}>
                    <UserProfile />
                  </Suspense>
                }/>
                
            </Route>
        </Routes>
    )
}