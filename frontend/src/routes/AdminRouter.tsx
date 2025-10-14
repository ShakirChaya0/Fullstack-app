import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";

// Skeletons y Layouts
const AdminMainLayout = lazy(() => import("../shared/components/AdminMainLayout"));
const SkeletonTableBody = lazy(() => import("../features/Tables/pages/SkeletonTableBody"));
const ProfileCardSkeleton = lazy(() => import("../features/Profile/components/ProfileCardSkeleton")); 

// Páginas de Administración (lazy loaded)
const TableCRUD = lazy(() => import("../features/Tables/pages/TableCRUD"));
const MainPanelSchedules = lazy(() => import("../features/Schedules/pages/MainPanelSchedules"));
const ModifySchedule = lazy(() => import("../features/Schedules/pages/ModifySchedule"));
const RegisterSchedule = lazy(() => import("../features/Schedules/pages/RegisterSchedules"));
const MainPanelProduct = lazy(() => import("../features/Product&Price/pages/MainPanelProduct"));
const PriceList = lazy(() => import("../features/Product&Price/pages/PriceList"));
const UserProfile = lazy(() => import("../features/Profile/pages/UserProfile"));
const NewsCRUD = lazy(() => import("../features/News/pages/NewsCRUD"));
const WaitersCRUD = lazy(() => import("../features/Waiter/pages/WaitersCRUD"));
const AdminHomepage = lazy(() => import("../shared/components/AdminHomePage"));
const DatosRestaurantes = lazy(() => import("../features/Institution/pages/Institution"));

export default function AdminRouter() {
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