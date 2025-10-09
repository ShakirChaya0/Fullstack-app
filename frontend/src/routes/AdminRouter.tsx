import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { AdminMainLayout } from "../shared/components/AdminMainLayout";
import SkeletonTableBody from "../features/Tables/pages/SkeletonTableBody";
const  TableCRUD = lazy(() => import("../features/Tables/pages/TableCRUD"));
import { MainPanelSchedules } from "../features/Schedules/pages/MainPanelSchedules";
import { ModifySchedule } from "../features/Schedules/pages/ModifySchedule";
import { RegisterSchedule } from "../features/Schedules/pages/RegisterSchedules";
import { MainPanelProduct } from "../features/Product&Price/pages/MainPanelProduct";
import { PriceList } from "../features/Product&Price/pages/PriceList";
const ProfileCardSkeleton = lazy(() => import("../features/Profile/components/ProfileCardSkeleton"));
const UserProfile = lazy(() => import("../features/Profile/pages/UserProfile"));
const NewsCRUD = lazy(() => import("../features/News/pages/NewsCRUD"))
const WaitersCRUD = lazy(() => import("../features/Waiter/pages/WaitersCRUD"))
const AdminHomepage = lazy(() => import("../shared/components/AdminHomePage"))
const DatosRestaurantes = lazy(() => import("../features/Institution/pages/Institution"));

export function AdminRouter() {
  return (
    <Routes>
      <Route element={<AdminMainLayout/>}>
        <Route path="/" element={<AdminHomepage/>}/>
        <Route path="/Novedades" element={ <NewsCRUD/>}/>
        <Route path="/DatosRestaurantes" element={<DatosRestaurantes/>}/>
        <Route path="/Mozos" element={<WaitersCRUD/>}/>
        <Route path="/Mesas" element={
          <Suspense fallback = {<SkeletonTableBody/>}>
            <TableCRUD/>
          </Suspense>
        }/> 
        <Route path="/Horarios" element={<MainPanelSchedules/>}/>
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