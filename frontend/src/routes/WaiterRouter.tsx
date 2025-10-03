import { Route, Routes } from "react-router";
import { ClientMainLayout } from "../shared/components/ClientMainLayout";
import { ReservationsView } from "../features/Reservation/pages/ReservationListToday";


export function WaiterRouter() {
    return (
        <Routes>
            <Route element={<ClientMainLayout />}>
                <Route path="/ReservaDelDia/" element={<ReservationsView />} />
            </Route>
        </Routes>

    )
}