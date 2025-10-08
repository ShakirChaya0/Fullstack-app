import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { ClientMainLayout } from "../shared/components/ClientMainLayout";
import { ReservationsView } from "../features/Reservation/pages/ReservationListToday";
const CreateOrder = lazy(() => import("../features/Tables/pages/CreateOrder"));
const ShowWaiterTables = lazy(() => import("../features/Tables/pages/ShowWaiterTables"))
const SkeletonCreateOrder = lazy(() => import("../features/Tables/pages/CreateOrderSkeletonBody"))
import { AvailableTable } from "../features/Tables/pages/AvailableTable";


export function WaiterRouter() {
    return (
        <Routes>
            <Route element={<ClientMainLayout />}>
                <Route path="/ReservaDelDia/" element={<ReservationsView />} />
                <Route path="/MesasDelRestaurante/" element={<ShowWaiterTables/>}/>
                <Route path="/CargarPedido/:nroMesa" element={
                    <Suspense fallback={<SkeletonCreateOrder/>}>
                        <CreateOrder/>
                    </Suspense>
                }/>
                <Route path="MesasDisponibles" element={<AvailableTable />} />
            </Route>
        </Routes>

    )
}