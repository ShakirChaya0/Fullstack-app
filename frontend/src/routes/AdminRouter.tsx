import { Route } from "react-router";
import { AdminMainLayout } from "../shared/components/AdminMainLayout";
import NewsCRUD from "../features/News/pages/NewsCRUD";



export function AdminRouter() {
  return (
    <>
        <Route element={<AdminMainLayout/>}>
            <Route path="/Admin" element={<h1>Hola admin</h1>}/>
            <Route path="/Admin/Novedades" element={<NewsCRUD/>}/>
        </Route>
    </>
  );
}