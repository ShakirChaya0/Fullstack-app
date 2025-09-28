import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { AdminMainLayout } from "../shared/components/AdminMainLayout";
import SkeletonTaleBody from "../features/Tables/pages/SkeletonTableBody";
import { TableCRUD } from "../features/Tables/pages/TableCRUD";
import { MainPanelSchedules } from "../features/Schedules/pages/MainPanelSchedules";
import { ModifySchedule } from "../features/Schedules/pages/ModifySchedule";
import { RegisterSchedule } from "../features/Schedules/pages/RegisterSchedules";
import { MainPanelProduct } from "../features/Product&Price/pages/MainPanelProduct";
import { PriceList } from "../features/Product&Price/pages/PriceList";
import UserProfile from "../features/Profile/pages/UserProfile";
import ProfileCardSkeleton from "../features/Profile/components/ProfileCardSkeleton";
const NewsCRUD = lazy(() => import("../features/News/pages/NewsCRUD"))
const WaitersCRUD = lazy(() => import("../features/Waiter/pages/WaitersCRUD"))

const DatosRestaurantes = lazy(() => import("../features/Institution/pages/Institution"));

export function AdminRouter() {
  return (
    <Routes>
      <Route element={<AdminMainLayout/>}>
        <Route path="/" element={<h1>Hola admin</h1>}/>
        <Route path="/Novedades" element={ <NewsCRUD/>}/>
        <Route path="/DatosRestaurantes" element={<DatosRestaurantes/>}/>
        <Route path="/Mozos" element={<WaitersCRUD/>}/>
        <Route path="/Mesas" element={
          <Suspense fallback = {<SkeletonTaleBody/>}>
            <TableCRUD/>
          </Suspense>
        }/> 
        <Route path="/Horarios" element={<MainPanelSchedules/>}/>{/* Borrar todos los registros de horarios de la Base de datos antes de ejecutar /Admin/Horarios */}
        <Route path="/Horarios/modificar" element={ <ModifySchedule/>}/>
        <Route path="Horarios/registrar" element={ <RegisterSchedule/>}/>
        <Route path="Productos" element={<MainPanelProduct/>}/>
        <Route path="Productos/Precio/:idProducto" element={<PriceList/>}/>
        <Route path="Perfil" element={
          <Suspense fallback = {<ProfileCardSkeleton/>}>
            <UserProfile />
          </Suspense>
        }/>
      </Route>
    </Routes>
  );
}