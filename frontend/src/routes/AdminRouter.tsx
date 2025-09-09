import { Route } from "react-router";
import { AdminMainLayout } from "../shared/components/AdminMainLayout";
import SkeletonInstitution  from "../features/Institution/pages/SkeletonInstitution";
import Institution  from "../features/Institution/pages/Institution";
import WaitersCRUD from "../features/Waiter/pages/WaitersCRUD";
import SkeletonTaleBody from "../features/Tables/pages/SkeletonTableBody";
import { TableCRUD } from "../features/Tables/pages/TableCRUD";
import { Suspense } from "react";
import NewsCRUD from "../features/News/pages/NewsCRUD";



export function AdminRouter() {
  return (
    <>
        <Route element={<AdminMainLayout/>}>
            <Route path="/Admin" element={<h1>Hola admin</h1>}/>
            <Route path="/Admin/Novedades" element={<NewsCRUD/>}/>
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
        </Route>
    </>
  );
}