import { Route } from "react-router";
import { Menu } from "../features/Products/pages/Menu";
import { ClientMainLayout } from "../shared/components/ClientMainLayout";
import DrinksList from "../features/Products/pages/DrinksList";
import FoodsList from "../features/Products/pages/FoodsList";
import ConfirmOrder from "../features/Products/pages/ConfirmOrder";




export function ClientRouter() {
  return (
    <>
        <Route element={<ClientMainLayout/>}>
            <Route path="/Menu" element={<Menu/>}/>
            <Route path="/Menu/Comidas" element={<FoodsList />}/>
            <Route path="/Menu/Bebidas" element={<DrinksList/>}/>
            <Route path="/Menu/RealizarPedido" element={<ConfirmOrder/>}/>
        </Route>
    </>
  );
}