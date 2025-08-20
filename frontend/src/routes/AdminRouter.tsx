import { Route } from "react-router";
import { lazy, Suspense } from "react";
import { AdminMainLayout } from "../shared/components/AdminMainLayout";
const NewsCRUD = lazy(() => import("../features/News/pages/NewsCRUD"))



export function AdminRouter() {
  return (
    <>
        <Route element={<AdminMainLayout/>}>
            <Route path="/Admin" element={<h1>Hola admin</h1>}/>
            <Route path="/Admin/Novedades" element={
              <Suspense fallback={<h1>Cargando...</h1>}>
                <NewsCRUD/>
              </Suspense>}/>
        </Route>
    </>
  );
}