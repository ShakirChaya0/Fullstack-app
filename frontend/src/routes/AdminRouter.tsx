import { Route } from "react-router";
import { lazy, Suspense } from "react";
import { AdminMainLayout } from "../shared/components/AdminMainLayout";
import SkeletonNewsBody from "../features/News/pages/SkeletonNewsBody";
const NewsCRUD = lazy(() => import("../features/News/pages/NewsCRUD"))
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