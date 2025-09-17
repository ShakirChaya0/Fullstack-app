import { Route, Routes } from "react-router";
import { AdminMainLayout } from "../shared/components/AdminMainLayout";
import SkeletonInstitution  from "../features/Institution/pages/SkeletonInstitution";
import Institution  from "../features/Institution/pages/Institution";
import WaitersCRUD from "../features/Waiter/pages/WaitersCRUD";
import SkeletonTaleBody from "../features/Tables/pages/SkeletonTableBody";
import { TableCRUD } from "../features/Tables/pages/TableCRUD";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainPanelSchedules } from "../features/Schedules/pages/MainPanelSchedules";
import { ModifySchedule } from "../features/Schedules/pages/ModifySchedule";
import NewsCRUD from "../features/News/pages/NewsCRUD";
import { RegisterSchedule } from "../features/Schedules/pages/RegisterSchedules";
import { MainPanelProduct } from "../features/Product&Price/pages/MainPanelProduct";
import { PriceList } from "../features/Product&Price/pages/PriceList";
import UserProfile from "../features/Profile/pages/UserProfile";
import ProfileCardSkeleton from "../features/Profile/components/ProfileCardSkeleton";


const queryClient = new QueryClient()

export function AdminRouter() {
  return (
    <Routes>
        <Route element={<AdminMainLayout/>}>
            <Route path="/Admin" element={<h1>Hola admin</h1>}/>
            <Route path="/Admin/Novedades" element={ <NewsCRUD/>}/>
            <Route path="/Admin/DatosRestaurantes" element={
              <Suspense fallback={<SkeletonInstitution/>}>
                  <Institution/>
              </Suspense>}/>
            <Route path="/Admin/Mozos" element={<WaitersCRUD/>}/>
            <Route path="/Admin/Mesas" element={
              <Suspense fallback = {<SkeletonTaleBody/>}>
                <TableCRUD/>
              </Suspense>
            }/> 
            {/* Borrar todos los registros de horarios de la Base de datos antes de ejecutar /Admin/Horarios */}
            <Route path="/Admin/Horarios" element={
              <QueryClientProvider client={queryClient}>
                <MainPanelSchedules/>
              </QueryClientProvider>
              }/>
            <Route path="/Admin/Horarios/modificar" element={
              <QueryClientProvider client={queryClient}>
                <ModifySchedule/>
              </QueryClientProvider>
              }/>
            <Route path="/Admin/Horarios/registrar" element={
              <QueryClientProvider client={queryClient}>
                <RegisterSchedule/>
              </QueryClientProvider>
              }/>
            <Route path="/Admin/Productos" element={
              <QueryClientProvider client={queryClient}>
                <MainPanelProduct/>
              </QueryClientProvider>
              }/>
            <Route path="/Admin/Productos/Precio/:idProducto" element={
              <QueryClientProvider client={queryClient}>
                <PriceList/>
              </QueryClientProvider>
              }/>
            <Route path="/Admin/Perfil" element={
              <Suspense fallback = {<ProfileCardSkeleton/>}>
                <UserProfile />
              </Suspense>
            }/>
        </Route>
    </Routes>
  );
}