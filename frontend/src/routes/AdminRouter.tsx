import { Route } from "react-router";
import { lazy, Suspense } from "react";
import { AdminMainLayout } from "../shared/components/AdminMainLayout";
import SkeletonNewsBody from "../features/News/pages/SkeletonNewsBody";
const NewsCRUD = lazy(() => import("../features/News/pages/NewsCRUD"))
import  SkeletonInstitution  from "../features/Institution/pages/SkeletonInstitution";
import  Institution  from "../features/Institution/pages/Insitution";



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
              <Institution/>
            }/>
        </Route>
    </>
  );
}