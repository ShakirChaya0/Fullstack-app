import { Route, Routes } from "react-router";
import { ClientMainLayout } from "../shared/components/ClientMainLayout";
import { ReservationsView } from "../features/Reservation/pages/ReservationListToday";
import { AvailableTable } from "../features/Tables/pages/AvailableTable";


export function WaiterRouter() {
    return (
        <Routes>
            <Route element={<ClientMainLayout />}>
                <Route path="/ReservaDelDia/" element={<ReservationsView />} />
                <Route path="MesasDisponibles" element={<AvailableTable />} />
            </Route>
        </Routes>

    )
}