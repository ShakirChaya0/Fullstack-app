import { Route } from "react-router";
import { lazy, Suspense } from "react";
import { AdminMainLayout } from "../shared/components/AdminMainLayout";
import SkeletonNewsBody from "../features/News/pages/SkeletonNewsBody";
import SkeletonTaleBody from "../features/Tables/pages/SkeletonTableBody";
import { TableCRUD } from "../features/Tables/pages/TableCRUD";
const NewsCRUD = lazy(() => import("../features/News/pages/NewsCRUD"))
 


export function AdminRouter() {
  return (
    <>
        <Route element={<AdminMainLayout/>}>
            <Route path="/Admin" element={<h1>Hola admin</h1>}/>
            <Route path="/Admin/Novedades" element={
              <Suspense fallback={<SkeletonNewsBody/>}>
                <NewsCRUD/>
              </Suspense>}/>
            <Route path="/Admin/Mesas" element={
              <Suspense fallback = {<SkeletonTaleBody/>}>
                <TableCRUD/>
              </Suspense>
            }/> 
        </Route>
    </>
  );
}