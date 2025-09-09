import { Route } from "react-router";
import { AdminMainLayout } from "../shared/components/AdminMainLayout";
import SkeletonNewsBody from "../features/News/pages/SkeletonNewsBody";
const NewsCRUD = lazy(() => import("../features/News/pages/NewsCRUD"))
import  SkeletonInstitution  from "../features/Institution/pages/SkeletonInstitution";
import  Institution  from "../features/Institution/pages/Institution";
import WaitersCRUD from "../features/Waiter/pages/WaitersCRUD";
import SkeletonTaleBody from "../features/Tables/pages/SkeletonTableBody";
import { TableCRUD } from "../features/Tables/pages/TableCRUD";
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainPanelSchedules } from "../features/Schedules/pages/mainPanelSchedules";
import { ModifySchedule } from "../features/Schedules/pages/ModifySchedule";

const queryClient = new QueryClient()

export function AdminRouter() {
  return (
    <>
        <Route element={<AdminMainLayout/>}>
            <Route path="/Admin" element={<h1>Hola admin</h1>}/>
            <Route path="/Admin/Novedades" element={
              <Suspense fallback={<SkeletonNewsBody/>}>
                <NewsCRUD/>
              </Suspense>}/>
            <Route path="/Admin/DatosRestaurantes" element={
              <Suspense fallback={<SkeletonInstitution/>}>
                  <Institution/>
              </Suspense>}/>
            <Route path="/Admin/Novedades" element={<NewsCRUD/>}/>
            <Route path="/Admin/Mozos" element={<WaitersCRUD/>}/>
            <Route path="/Admin/Mesas" element={
              <Suspense fallback = {<SkeletonTaleBody/>}>
                <TableCRUD/>
              </Suspense>
            }/> 
            <Route path="/Admin/Horarios" element={
              <QueryClientProvider client={queryClient}>
                <MainPanelSchedules></MainPanelSchedules>
              </QueryClientProvider>
              }/>
            <Route path="/Admin/Horarios/modificar" element={
              <QueryClientProvider client={queryClient}>
                <ModifySchedule></ModifySchedule>
              </QueryClientProvider>
              }/>
        </Route>
    </>
  );
}