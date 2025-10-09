import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
const ReservationsView = lazy(() => import("../features/Reservation/pages/ReservationListToday"));
const CreateOrder = lazy(() => import("../features/Tables/pages/CreateOrder"));
const ShowWaiterTables = lazy(() => import("../features/Tables/pages/ShowWaiterTables"))
const SkeletonCreateOrder = lazy(() => import("../features/Tables/pages/CreateOrderSkeletonBody"))
const AvailableTable = lazy (() => import("../features/Tables/pages/AvailableTable"));
import { WaiterMainLayout } from "../shared/components/WaiterMainLayout";
import WaiterHomepage from "../shared/components/WaiterHomePage";


export function WaiterRouter() {
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
            </Route>
        </Routes>

    )
}