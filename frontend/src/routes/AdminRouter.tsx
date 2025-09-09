import { Route } from "react-router";
import { AdminMainLayout } from "../shared/components/AdminMainLayout";
import NewsCRUD from "../features/News/pages/NewsCRUD";
import WaitersCRUD from "../features/Waiter/pages/WaitersCRUD";
import SkeletonTableBody from "../features/Tables/pages/SkeletonTableBody";
import { TableCRUD } from "../features/Tables/pages/TableCRUD";
import { Suspense } from "react";



export function AdminRouter() {
  return (
    <>
        <Route element={<AdminMainLayout/>}>
            <Route path="/Admin" element={<h1>Hola admin</h1>}/>
            <Route path="/Admin/Novedades" element={<NewsCRUD/>}/>
            <Route path="/Admin/Mozos" element={<WaitersCRUD/>}/>
            <Route path="/Admin/Mesas" element={
              <Suspense fallback = {<SkeletonTableBody/>}>
                <TableCRUD/>
              </Suspense>
            }/> 
        </Route>
    </>
  );
}