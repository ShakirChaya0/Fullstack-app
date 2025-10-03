import { Route, Routes } from "react-router";
import { lazy } from "react";
import { ClientMainLayout } from "../shared/components/ClientMainLayout";
import { ReservationsView } from "../features/Reservation/pages/ReservationListToday";
const CreateOrder = lazy(() => import("../features/Tables/pages/CreateOrder"));
const ShowWaiterTables = lazy(() => import("../features/Tables/pages/ShowWaiterTables"))

export function WaiterRouter() {
    return (
        <Routes>
            <Route element={<ClientMainLayout />}>
                <Route path="/ReservaDelDia/" element={<ReservationsView />} />
                <Route path="/MesasDelRestaurante/" element={<ShowWaiterTables/>}/>
                <Route path="/CargarPedido/" element={<CreateOrder/>}/>
            </Route>
        </Routes>

    )
}